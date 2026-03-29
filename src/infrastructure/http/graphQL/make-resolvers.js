import { DateTimeResolver } from "graphql-scalars";
import { GraphQLError } from "graphql";
import { AppError } from "../../../application/errors/app-error.js";

function makeResolvers({
    listCyclistUseCase,
    listRegistrationRideUseCase,
    findRideByIdUseCase,
    createCyclistUseCase,
    createRideUseCase,
    createRegistrationRideUseCase,
    cacheRepository,
}) {
    const getOrSetCache = async (key, callback) => {
        const valueCached = await cacheRepository.existsDataInCache(key);

        if (valueCached) {
            return valueCached;
        }

        const value = await callback();
        await cacheRepository.addInCache(key, value);
        return value;
    };

    const resolveWithErrorMapping = async (resolver) => {
        try {
            return await resolver();
        } catch (error) {
            if (error instanceof AppError) {
                throw new GraphQLError(error.message, {
                    extensions: {
                        code: error.code,
                        statusCode: error.statusCode,
                        details: error.details ?? null,
                    },
                });
            }

            throw new GraphQLError("Internal server error", {
                extensions: {
                    code: "INTERNAL_SERVER_ERROR",
                    statusCode: 500,
                },
            });
        }
    };

    return {
        Query: {
            cyclist: async () => {
                return resolveWithErrorMapping(() => getOrSetCache("cyclist", async () => {
                    const { cyclist } = await listCyclistUseCase.execute();
                    return cyclist;
                }));
            },

            ride: async (_, { id }) => {
                return resolveWithErrorMapping(() => getOrSetCache(`ride-${id}`, async () => {
                    const { ride } = await findRideByIdUseCase.execute(id);
                    return ride;
                }));
            },

            registrationRide:  async (_, { id }) => {
                return resolveWithErrorMapping(() => getOrSetCache(`registration-${id}`, async () => {
                    const { registrationRide } = await listRegistrationRideUseCase.execute(id);
                    return registrationRide;
                }));
            }
        },
        DateTime: DateTimeResolver,
        Mutation: {
            createCyclist: async (_, { name, email, password }) => {
                return resolveWithErrorMapping(async () => {
                    const { cyclist } = await createCyclistUseCase.execute({ name, email, password })
                    return cyclist;
                });
            },

            createRide: async (_, { name, starDate, starDateRegistration, endDateRegistration, startPlace, additionalInformation, participantsLimit }) => {
                return resolveWithErrorMapping(async () => {
                    const { ride } = await createRideUseCase.execute({
                        name,
                        starDate,
                        starDateRegistration,
                        endDateRegistration,
                        startPlace,
                        additionalInformation,
                        participantsLimit
                    });

                    return ride;
                });
            },

            createRegistrationRide: async (_, { rideId, cyclistId, subscriptionDate }) => {
                return resolveWithErrorMapping(async () => {
                    const { registrationRide } = await createRegistrationRideUseCase.execute({ rideId, cyclistId, subscriptionDate });
                    return registrationRide;
                });
            }
        }
    }
}

export { makeResolvers }
