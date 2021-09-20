import { Span } from "opentracing";


const contextService = require('request-context');

export function set(key: string, value: Span) {
    contextService.set('request:' + key, value);
}

export function get(key: string) {
   return contextService.get('request:' + key);
}

export const middleware = () => contextService.middleware('request');