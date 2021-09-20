import { API_URL } from './config';

export function fetchApiJson(url) {
    return fetch(`${API_URL}/api${url}`, {
        headers: new Headers({
            "Authorization": "Bearer " + window.accessToken,
        })
    }).then(r => r.json());
}