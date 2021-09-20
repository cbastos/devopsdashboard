import { injectable } from 'inversify';
import redis, { RedisClient } from 'redis';
import Cache from './cache';

@injectable()
export default class RedisCacheClient implements Cache {
    private redisClient: RedisClient;

    constructor() {
        this.redisClient = redis.createClient({ host: process.env.REDIS_HOST, port: parseInt(process.env.REDIS_PORT) });
        this.redisClient.on('error', (error) => console.error(error));
    }

    getOrSet<T>(key: string, asyncGetter: () => Promise<T>): Promise<T> {
        return new Promise((resolve) => {
            if (this.redisClient.connected) {
                this.redisClient.get(key, (error, cachedData) => {
                    if (cachedData === 'null' || !cachedData) {
                        asyncGetter().then((data) => {
                            console.log(`Retrieved ${key} from async getter`);
                            this.redisClient.set(key, JSON.stringify(data), () => {
                                resolve(data);
                            });
                        });
                    } else {
                        console.log(`Retrieved ${key} from cache`);
                        resolve(JSON.parse(cachedData));
                    }
                });
            } else {
                console.log('Cache not connected, retrieved data from async getter');
                asyncGetter().then(resolve);
            }
        });
    }

    set<T>(key: string, data: any): Promise<void> {
        return new Promise((resolve) => {
            this.redisClient.set(key, JSON.stringify(data), () => {
                resolve();
            });
        });
    }

    flushAll(): Promise<void> {
        return new Promise((resolve) => {
            this.redisClient.flushall(() => void resolve());
        });
    }

}
