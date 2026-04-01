import { redis } from "../connection/redis.js";
import { CachePort } from "../../../application/ports/cache-port.js";

export class CacheRepository extends CachePort {
    
    async addInCache(keyName, data) {
        await redis.set(keyName, JSON.stringify(data));
        return;
    }

    async existsDataInCache(keyName) {
        const cachedValue = await redis.get(keyName);
        if (cachedValue !== null) {
            try {
                return JSON.parse(cachedValue);
            } catch {
                return cachedValue;
            }
        }

        return false;
    }
}
