import Fastify from "fastify";
import { afterEach, beforeEach, describe, it } from "node:test";
import { deepStrictEqual, strictEqual } from "node:assert";
import { RegistrationRideController } from "../../src/infrastructure/http/rest/controller/registrationRide/registration-ride-controller.js";
import { JoiValidatorAdapter } from "../../src/infrastructure/http/rest/libs/joi.js";

describe("RegistrationRideController", () => {
  let app;
  let calls;

  beforeEach(async () => {
    app = Fastify();
    calls = [];
    const cache = new Map();

    RegistrationRideController.configure({
      validator: new JoiValidatorAdapter(),
      createUseCaseFactory: () => ({
        execute: async (payload) => {
          calls.push(payload);
          return { registrationRide: { id: "r1", ...payload } };
        },
      }),
      listUseCaseFactory: () => ({
        execute: async () => ({
          registrationRide: [{ id: "reg-1", rideId: "ride-1", cyclistId: "cyclist-auth" }],
        }),
      }),
      cacheRepositoryFactory: () => ({
        existsDataInCache: async (key) => cache.get(key) ?? false,
        addInCache: async (key, value) => cache.set(key, value),
      }),
    });

    app.decorateRequest("user", null);
    app.addHook("preHandler", async (request) => {
      request.user = { sub: "cyclist-auth" };
    });

    app.post("/api/registration/ride", RegistrationRideController.create);
    app.get("/api/registration/ride", RegistrationRideController.findById);
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it("should ignore cyclistId from body and use authenticated cyclist", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/registration/ride",
      payload: {
        rideId: "550e8400-e29b-41d4-a716-446655440000",
        subscriptionDate: "2026-03-29T00:00:00.000Z",
        cyclistId: "malicious-user",
      },
    });

    strictEqual(response.statusCode, 201);
    strictEqual(calls[0].cyclistId, "cyclist-auth");
  });

  it("should return same response shape for cache miss and cache hit", async () => {
    const first = await app.inject({
      method: "GET",
      url: "/api/registration/ride",
    });
    strictEqual(first.statusCode, 200);
    deepStrictEqual(first.json(), {
      registrationRide: [{ id: "reg-1", rideId: "ride-1", cyclistId: "cyclist-auth" }],
    });

    const second = await app.inject({
      method: "GET",
      url: "/api/registration/ride",
    });
    strictEqual(second.statusCode, 200);
    deepStrictEqual(second.json(), {
      registrationRide: [{ id: "reg-1", rideId: "ride-1", cyclistId: "cyclist-auth" }],
    });
  });
});
