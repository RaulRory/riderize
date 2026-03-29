import { verifyJwt } from "../../middleware/verify-jwt.js";
import { RideController } from "./ride-controller.js";
import { JoiValidatorAdapter } from "../../libs/joi.js";
import { makeCreateRideUseCase } from "../../factories/makeCreateRideUseCase.js";
import { makeFindRideBydIdUseCase } from "../../factories/makeFindRideByIdUseCase.js";
import { CacheRepository } from "../../../../database/redis/redis-repository.js";

export async function rideRoutes(appInstance) {
    RideController.configure({
        validator: new JoiValidatorAdapter(),
        createUseCaseFactory: makeCreateRideUseCase,
        findByIdUseCaseFactory: makeFindRideBydIdUseCase,
        cacheRepositoryFactory: () => new CacheRepository(),
    });

    appInstance.addHook("onRequest", verifyJwt)

    appInstance.post("/ride",  RideController.create)
    appInstance.get("/ride/:id", RideController.findById)
}
