import { DateTimeResolver } from "graphql-scalars";

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

    return {
        Query: {
            cyclist: async () => {
                return getOrSetCache("cyclist", async () => {
                    const { cyclist } = await listCyclistUseCase.execute();
                    return cyclist;
                });
            },

            ride: async (_, { id }) => {
                return getOrSetCache(`ride-${id}`, async () => {
                    const { ride } = await findRideByIdUseCase.execute(id);
                    return ride;
                });
            },

            registrationRide:  async (_, { id }) => {
                return getOrSetCache(`registration-${id}`, async () => {
                    const { registrationRide } = await listRegistrationRideUseCase.execute(id);
                    return registrationRide;
                });
            }
        },
        DateTime: DateTimeResolver,
        Mutation: {
            createCyclist: async (_, { name, email, password }) => {
                const { cyclist } = await createCyclistUseCase.execute({ name, email, password })
                return cyclist;
            },

            createRide: async (_, { name, starDate, starDateRegistration, endDateRegistration, startPlace, additionalInformation, participantsLimit }) => {
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
            },

            createRegistrationRide: async (_, { rideId, cyclistId, subscriptionDate }) => {
                const { registrationRide } = await createRegistrationRideUseCase.execute({ rideId, cyclistId, subscriptionDate });
                return registrationRide;
            }
        }
    }
}

export { makeResolvers }
