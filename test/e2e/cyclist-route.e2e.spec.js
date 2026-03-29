import Fastify from "fastify";
import { afterEach, beforeEach, describe, it } from "node:test";
import { deepStrictEqual, strictEqual } from "node:assert";
import { CyclistController } from "../../src/infrastructure/http/rest/controller/cyclist/cyclist-controller.js";
import { JoiValidatorAdapter } from "../../src/infrastructure/http/rest/libs/joi.js";

describe("Cyclist route E2E (with injected dependencies)", () => {
  let app;
  let capturedCreatePayload;

  beforeEach(async () => {
    app = Fastify();

    const cacheState = new Map();

    CyclistController.configure({
      validator: new JoiValidatorAdapter(),
      createUseCaseFactory: () => ({
        execute: async ({ name, email, password }) => {
          capturedCreatePayload = { name, email, password };
          return {
          cyclist: { id: "c1", name, email },
          };
        },
      }),
      listUseCaseFactory: () => ({
        execute: async () => ({
          cyclist: [{ id: "c1", name: "John", email: "john@test.dev" }],
        }),
      }),
      cacheRepositoryFactory: () => ({
        existsDataInCache: async (key) => cacheState.get(key) ?? false,
        addInCache: async (key, value) => {
          cacheState.set(key, value);
        },
      }),
    });

    app.decorateReply("jwtSign", async () => "token-test");
    app.post("/api/cyclists", CyclistController.create);
    app.get("/api/cyclists", CyclistController.fetch);

    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it("should create cyclist with validated payload", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/cyclists",
      payload: {
        name: "John Doe",
        email: "john@doe.com",
        password: "123456",
        ignored: "field",
      },
    });

    strictEqual(response.statusCode, 201);
    deepStrictEqual(capturedCreatePayload, {
      name: "John Doe",
      email: "john@doe.com",
      password: "123456",
    });
    deepStrictEqual(response.json(), {
      id: "c1",
      name: "John Doe",
      email: "john@doe.com",
      token: "token-test",
    });
  });

  it("should return cyclists list and support cache read", async () => {
    const first = await app.inject({
      method: "GET",
      url: "/api/cyclists",
    });

    strictEqual(first.statusCode, 200);
    deepStrictEqual(first.json(), {
      cyclist: [{ id: "c1", name: "John", email: "john@test.dev" }],
    });

    const second = await app.inject({
      method: "GET",
      url: "/api/cyclists",
    });

    strictEqual(second.statusCode, 200);
    deepStrictEqual(second.json(), {
      cyclist: [{ id: "c1", name: "John", email: "john@test.dev" }],
    });
  });
});
