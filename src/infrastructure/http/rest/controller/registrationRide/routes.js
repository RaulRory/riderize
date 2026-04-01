import { verifyJwt } from "../../middleware/verify-jwt.js";
import { RegistrationRideController } from "./registration-ride-controller.js";
import { JoiValidatorAdapter } from "../../libs/joi.js";
import { makeRegistrationRideUseCase } from "../../factories/makeRegistrationRideUseCase.js";
import { makeListRegistrationRideUseCase } from "../../factories/makeListRegistrationRideUseCase.js";
import { CacheRepository } from "../../../../database/redis/redis-repository.js";


export async function registrationRideRoutes(appInstance) {
    RegistrationRideController.configure({
        validator: new JoiValidatorAdapter(),
        createUseCaseFactory: makeRegistrationRideUseCase,
        listUseCaseFactory: makeListRegistrationRideUseCase,
        cacheRepositoryFactory: () => new CacheRepository(),
    });

    appInstance.addHook("onRequest", verifyJwt)

    appInstance.post("/registration/ride",  RegistrationRideController.create)
    appInstance.get("/registration/ride", RegistrationRideController.findById)
}
