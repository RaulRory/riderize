import { CyclistController } from "./cyclist-controller.js"
import { JoiValidatorAdapter } from "../../libs/joi.js";
import { makeCreateCyclyitUseCase } from "../../factories/makeCreateCiclystUseCase.js";
import { makeListCyclistUseCase } from "../../factories/makeListCyclistUseCase.js";
import { CacheRepository } from "../../../../database/redis/redis-repository.js";

export async function cyclistRoutes(appInstance) {
    CyclistController.configure({
        validator: new JoiValidatorAdapter(),
        createUseCaseFactory: makeCreateCyclyitUseCase,
        listUseCaseFactory: makeListCyclistUseCase,
        cacheRepositoryFactory: () => new CacheRepository(),
    });

    appInstance.post("/cyclists", CyclistController.create);
    appInstance.get("/cyclists", CyclistController.fetch)
}
