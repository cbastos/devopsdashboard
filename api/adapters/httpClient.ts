
export default interface HttpClient {
    getJson<T>(url, options): Promise<T>;
}