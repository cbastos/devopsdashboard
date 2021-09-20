import { get } from '../httpContext';
import HttpClient from './httpClient';
import * as opentracing from 'opentracing';

export default class TrazedHttpClient implements HttpClient {

    constructor(private httpClient: HttpClient) { }

    async getJson<T>(url: string, options: any): Promise<T> {
        const tracer = opentracing.globalTracer();
        const httpContextSpan: any = get('http_request_span');
        const span = tracer.startSpan('http_client', { childOf: httpContextSpan });
        span.log({ event: 'get_json_resquest_start', url, options });
        const data = await this.httpClient.getJson<T>(url, options);
        span.log({ event: 'get_json_request_end', data });
        span.finish();
        return data;
    }
}
