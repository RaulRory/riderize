import { DateTimeResolver } from "graphql-scalars";
import { makeCreateCyclyitUseCase } from "../rest/factories/makeCreateCiclystUseCase.js"
import { makeCreateRideUseCase } from "../rest/factories/makeCreateRideUseCase.js";
import { makeFindRideBydIdUseCase } from "../rest/factories/makeFindRideByIdUseCase.js";
import { makeListCyclistUseCase } from "../rest/factories/makeListCyclistUseCase.js"
import { makeListRegistrationRideUseCase } from "../rest/factories/makeListRegistrationRideUseCase.js";
import { makeRegistrationRideUseCase } from "../rest/factories/makeRegistrationRideUseCase.js";
import { CacheRepository } from "../../database/redis/redis-repository.js";

const listCyclistUseCase = makeListCyclistUseCase();
const listRegistrationRideUseCase = makeListRegistrationRideUseCase()
const findRideByIdUseCase = makeFindRideBydIdUseCase()
const createCyclistUseCase = makeCreateCyclyitUseCase();
const createRideUseCase = makeCreateRideUseCase();
const createRegistrationRide = makeRegistrationRideUseCase();
const redisCache = new CacheRepository();

export const resolvers = {
    Query: {
        cyclist: async () => {
            const valueCached = await redisCache.existsDataInCache("cyclist");
            
            if(valueCached) {
                return valueCached;
            }

            const { cyclist } = await listCyclistUseCase.execute();
            return cyclist;
        },

        ride: async (_, { id }) => {
            const valueCached = await redisCache.existsDataInCache(`ride-${id}`);
            if(valueCached) {
                return valueCached;
            }
            const { ride } = await findRideByIdUseCase.execute(id);
            return ride;
        },

        registrationRide:  async (_, { id }) => {
            const valueCached = await redisCache.existsDataInCache(`registration-${id}`);
            if(valueCached) {
                return valueCached;
            }

            const { registrationRide } = await listRegistrationRideUseCase.execute(id);
            return registrationRide;
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
            const { registrationRide } = await createRegistrationRide.execute({ rideId, cyclistId, subscriptionDate });

            return registrationRide;
        }
    }
}