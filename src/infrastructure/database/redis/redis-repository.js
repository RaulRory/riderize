import { redis } from "../connection/redis.js";

export class CacheRepository {
    
    async addInCache(keyName, data) {
        await redis.set(keyName, data);
        return;
    }

    async existsDataInCache(keyName) {
        const cachedValue = await redis.get(keyName);
        if (cachedValue !== null) {
            return JSON.parse(cachedValue);
        }

        return false;
    }
}