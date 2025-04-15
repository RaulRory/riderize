import Fastify from 'fastify';
import { describe, it, beforeEach, afterEach } from 'node:test';
import { deepStrictEqual, strictEqual} from 'node:assert';
import { CyclistController } from "../../src/infrastructure/http/rest/controller/cyclist/cyclist-controller.js";
import { CacheRepository } from "../../src/infrastructure/database/redis/redis-repository.js";
import { makeListCyclistUseCase } from "../../src/infrastructure/http/rest/factories/makeListCyclistUseCase.js"

describe('Cyclist Controller E2E', () => {
    let fastify;

    beforeEach(async () => {
        fastify = Fastify();
        const mockCacheRepository = new CacheRepository();
        const mockListCyclistUseCase = makeListCyclistUseCase();
    
        fastify.decorate('CacheRepository', mockCacheRepository);
        fastify.decorate('makeListCyclistUseCase', mockListCyclistUseCase);
    
        fastify.get('/api/cyclists', CyclistController.fetch);
        await fastify.ready();
    })

    
    afterEach(async () => {
        await fastify.close();
    });

    it('should return cached cyclist data if available', async () => {
        const mockCacheRepository = new CacheRepository();
        mockCacheRepository.existsDataInCache = (key) => key === "cyclist" ? [{ id: 1, name: 'John Doe' }] : null;
        const mockListCyclistUseCase = makeListCyclistUseCase();
        mockListCyclistUseCase.execute = async () => ({ cyclist: [{ id: 1, name: 'Jane Doe' }] });

        const response = await fastify.inject({
            method: 'GET',
            url: '/api/cyclists'
        });

        strictEqual(response.statusCode, 200);
        deepStrictEqual(response.json(), { cyclist: [{ id: 1, name: 'John Doe' }] });
    });

    it('should return cyclist data from use case if not cached', async () => {
        const mockCacheRepository = new CacheRepository();
        mockCacheRepository.existsDataInCache = () => false;
        const mockListCyclistUseCase = makeListCyclistUseCase();
        mockListCyclistUseCase.execute = async () => ({ cyclist: [{ id: 1, name: 'Jane Doe' }] });

        const response = await fastify.inject({
            method: 'GET',
            url: '/api/cyclists'
        });

        strictEqual(response.statusCode, 200);
        deepStrictEqual(response.json(), { cyclist: [{ id: 1, name: 'Jane Doe' }] });
    });
});