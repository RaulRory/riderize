import { makeCreateCyclyitUseCase } from "../rest/factories/makeCreateCiclystUseCase.js"
import { makeCreateRideUseCase } from "../rest/factories/makeCreateRideUseCase.js";
import { makeFindRideBydIdUseCase } from "../rest/factories/makeFindRideByIdUseCase.js";
import { makeListCyclistUseCase } from "../rest/factories/makeListCyclistUseCase.js"
import { makeListRegistrationRideUseCase } from "../rest/factories/makeListRegistrationRideUseCase.js";
import { makeRegistrationRideUseCase } from "../rest/factories/makeRegistrationRideUseCase.js";
import { CacheRepository } from "../../database/redis/redis-repository.js";
import { makeResolvers } from "./make-resolvers.js";

export const resolvers = makeResolvers({
    listCyclistUseCase: makeListCyclistUseCase(),
    listRegistrationRideUseCase: makeListRegistrationRideUseCase(),
    findRideByIdUseCase: makeFindRideBydIdUseCase(),
    createCyclistUseCase: makeCreateCyclyitUseCase(),
    createRideUseCase: makeCreateRideUseCase(),
    createRegistrationRideUseCase: makeRegistrationRideUseCase(),
    cacheRepository: new CacheRepository(),
});
