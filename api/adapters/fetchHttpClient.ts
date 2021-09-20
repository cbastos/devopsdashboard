import { injectable } from 'inversify';
import 'isomorphic-fetch';
import HttpClient from './httpClient';

@injectable()
export default class FetchHttpClient implements HttpClient {
    getJson(url: RequestInfo, options: RequestInit) {
        return fetch(url, options).then(r => r.json());
    }
}