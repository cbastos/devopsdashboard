export default interface Cache {
    getOrSet<T>(key:string, asyncGetter: () => Promise<T>): Promise<T>;
    set<T>(key: string, data:any): Promise<void>;
    flushAll(): Promise<void>;
}
