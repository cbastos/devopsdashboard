import * as opentracing from 'opentracing';
import { ZipkinB3TextMapCodec, initTracerFromEnv } from 'jaeger-client';
import url from 'url';
import { set } from './httpContext';

const serviceName = process.env.TRACER_SERVICE_NAME || 'devopsdashboard_webapi';
var config = { serviceName, sampler: { type: 'const', param: 1 }, reporter: { logSpans: true } };
const tracer = initTracerFromEnv(config, {});

opentracing.initGlobalTracer(tracer);

if (process.env.ZIPKIN_HEADERS) {
    console.debug('request contains zipkin headers')
    var codec = new ZipkinB3TextMapCodec({ urlEncoding: true });
    tracer.registerInjector(opentracing.FORMAT_HTTP_HEADERS, codec);
    tracer.registerExtractor(opentracing.FORMAT_HTTP_HEADERS, codec);
}

export default () => {
    return (req: any, res: any, next: any) => {
        const wireCtx = tracer.extract(opentracing.FORMAT_HTTP_HEADERS, req.headers);
        const pathname = url.parse(req.url).pathname;
        const span = tracer.startSpan(pathname, { childOf: wireCtx });
        span.log({ 'event': 'request_received' });
        span.log(req.headers)

        const traceIdInHeader = req.get('x-b3-traceid');
        if (traceIdInHeader) {
            span.setTag('x_b3_traceid', traceIdInHeader);
        }
        span.setTag(opentracing.Tags.HTTP_METHOD, req.method);
        span.setTag(opentracing.Tags.SPAN_KIND, opentracing.Tags.SPAN_KIND_RPC_SERVER);
        span.setTag(opentracing.Tags.HTTP_URL, req.url);
        const responseHeaders = {};
        tracer.inject(span, opentracing.FORMAT_HTTP_HEADERS, responseHeaders);
        res.set(responseHeaders)
        set('http_request_span', span);

        res.on('finish', () => {
            span.setTag(opentracing.Tags.HTTP_STATUS_CODE, res.statusCode);
            if (res.statusCode >= 500) {
                span.setTag(opentracing.Tags.ERROR, true);
                span.setTag(opentracing.Tags.SAMPLING_PRIORITY, 1);
                span.log({ 'event': 'error', 'message': res.statusMessage });
            }
            span.log({ 'event': 'request_end' });
            span.finish();
        });
        next();
    }
}

export { tracer }