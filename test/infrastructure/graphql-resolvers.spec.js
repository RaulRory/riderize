import { describe, it } from "node:test";
import { deepStrictEqual, rejects, strictEqual } from "node:assert";
import { makeResolvers } from "../../src/infrastructure/http/graphQL/make-resolvers.js";
import { AppError } from "../../src/application/errors/app-error.js";

describe("GraphQL resolvers", () => {
  it("should cache query results and reuse cached value", async () => {
    const state = new Map();
    let listCyclistCalls = 0;

    const resolvers = makeResolvers({
      listCyclistUseCase: {
        execute: async () => {
          listCyclistCalls += 1;
          return { cyclist: [{ id: "c1", name: "John", email: "john@test.dev" }] };
        },
      },
      listRegistrationRideUseCase: { execute: async () => ({ registrationRide: [] }) },
      findRideByIdUseCase: { execute: async () => ({ ride: {} }) },
      createCyclistUseCase: { execute: async () => ({ cyclist: {} }) },
      createRideUseCase: { execute: async () => ({ ride: {} }) },
      createRegistrationRideUseCase: { execute: async () => ({ registrationRide: {} }) },
      cacheRepository: {
        existsDataInCache: async (key) => state.get(key) ?? false,
        addInCache: async (key, value) => state.set(key, value),
      },
    });

    const first = await resolvers.Query.cyclist();
    const second = await resolvers.Query.cyclist();

    strictEqual(listCyclistCalls, 1);
    deepStrictEqual(first, [{ id: "c1", name: "John", email: "john@test.dev" }]);
    deepStrictEqual(second, [{ id: "c1", name: "John", email: "john@test.dev" }]);
  });

  it("should keep createRegistrationRide contract in camelCase", async () => {
    const resolvers = makeResolvers({
      listCyclistUseCase: { execute: async () => ({ cyclist: [] }) },
      listRegistrationRideUseCase: { execute: async () => ({ registrationRide: [] }) },
      findRideByIdUseCase: { execute: async () => ({ ride: {} }) },
      createCyclistUseCase: { execute: async () => ({ cyclist: {} }) },
      createRideUseCase: { execute: async () => ({ ride: {} }) },
      createRegistrationRideUseCase: {
        execute: async ({ rideId, cyclistId, subscriptionDate }) => ({
          registrationRide: { rideId, cyclistId, subscriptionDate },
        }),
      },
      cacheRepository: {
        existsDataInCache: async () => false,
        addInCache: async () => {},
      },
    });

    const payload = await resolvers.Mutation.createRegistrationRide(
      null,
      { rideId: "r1", cyclistId: "c1", subscriptionDate: "2026-03-29T00:00:00.000Z" }
    );

    deepStrictEqual(payload, {
      rideId: "r1",
      cyclistId: "c1",
      subscriptionDate: "2026-03-29T00:00:00.000Z",
    });
  });

  it("should map AppError to GraphQL error extensions", async () => {
    const resolvers = makeResolvers({
      listCyclistUseCase: {
        execute: async () => {
          throw new AppError("Cyclist not found!", {
            code: "CYCLIST_NOT_FOUND",
            statusCode: 404,
          });
        },
      },
      listRegistrationRideUseCase: { execute: async () => ({ registrationRide: [] }) },
      findRideByIdUseCase: { execute: async () => ({ ride: {} }) },
      createCyclistUseCase: { execute: async () => ({ cyclist: {} }) },
      createRideUseCase: { execute: async () => ({ ride: {} }) },
      createRegistrationRideUseCase: { execute: async () => ({ registrationRide: {} }) },
      cacheRepository: {
        existsDataInCache: async () => false,
        addInCache: async () => {},
      },
    });

    await rejects(async () => {
      await resolvers.Query.cyclist();
    }, (error) => {
      strictEqual(error.message, "Cyclist not found!");
      strictEqual(error.extensions.code, "CYCLIST_NOT_FOUND");
      strictEqual(error.extensions.statusCode, 404);
      return true;
    });
  });
});
