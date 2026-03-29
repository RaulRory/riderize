import Fastify from 'fastify';
import { describe, it, beforeEach, afterEach } from 'node:test';
import { deepStrictEqual, strictEqual} from 'node:assert';
import { CyclistController } from "../../src/infrastructure/http/rest/controller/cyclist/cyclist-controller.js";
import { JoiValidatorAdapter } from "../../src/infrastructure/http/rest/libs/joi.js";

describe('Cyclist Controller E2E', () => {
    let fastify;
    let cacheState;

    beforeEach(async () => {
        fastify = Fastify();
        cacheState = new Map();

        CyclistController.configure({
            validator: new JoiValidatorAdapter(),
            createUseCaseFactory: () => ({
                execute: async ({ name, email }) => ({ cyclist: { id: "c1", name, email } })
            }),
            listUseCaseFactory: () => ({
                execute: async () => ({ cyclist: [{ id: 1, name: 'Jane Doe' }] })
            }),
            cacheRepositoryFactory: () => ({
                existsDataInCache: async (key) => cacheState.get(key) ?? false,
                addInCache: async (key, value) => cacheState.set(key, value),
            })
        });

        fastify.decorate('jwtSign', async () => 'token-test');
        fastify.get('/api/cyclists', CyclistController.fetch);
        await fastify.ready();
    })

    
    afterEach(async () => {
        await fastify.close();
    });

    it('should return cached cyclist data if available', async () => {
        cacheState.set("cyclist", [{ id: 1, name: 'John Doe' }]);

        const response = await fastify.inject({
            method: 'GET',
            url: '/api/cyclists'
        });

        strictEqual(response.statusCode, 200);
        deepStrictEqual(response.json(), { cyclist: [{ id: 1, name: 'John Doe' }] });
    });

    it('should return cyclist data from use case if not cached', async () => {
        const response = await fastify.inject({
            method: 'GET',
            url: '/api/cyclists'
        });

        strictEqual(response.statusCode, 200);
        deepStrictEqual(response.json(), { cyclist: [{ id: 1, name: 'Jane Doe' }] });
    });
});
