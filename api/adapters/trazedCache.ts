import { get } from '../httpContext';
import Cache from './cache';
import * as opentracing from 'opentracing';

export default class TrazedCache implements Cache {

    constructor(private cache: Cache) { }

    async getOrSet<T>(key: string, asyncGetter: any): Promise<T> {
        const span = this.getHttpContextChildSpan('cache-get-or-set');
        span.log({ event: 'cache_request_start', key });
        const dataFromCache = await this.cache.getOrSet<T>(key, async (...params) => {
            span.log({ event: 'async_getter_called' });
            const data = await asyncGetter(...params);
            span.log({ event: 'async_getter_data_retrieved', data });
            return data;
        });
        span.log({ event: 'cache_request_end' });
        span.finish();
        return dataFromCache;
    }

    private getHttpContextChildSpan(name: string) {
        const tracer = opentracing.globalTracer();
        const httpContextSpan: any = get('http_request_span');
        return tracer.startSpan(name, { childOf: httpContextSpan });
    }

    async set<T>(key: string, data: any): Promise<void> {
        const span = this.getHttpContextChildSpan('cache-set');
        span.log({ event: 'cache_set_start', key });
        await this.cache.set<T>(key, data);
        span.log({ event: 'cache_set_end' });
        span.finish();
    }

    async flushAll(): Promise<void> {
        const span = this.getHttpContextChildSpan('cache-flush');
        span.log({ event: 'cache_flush_all_start' });
        await this.cache.flushAll();
        span.log({ event: 'cache_flush_all_end' });
        span.finish();
    }
}