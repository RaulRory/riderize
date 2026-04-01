import Joi from "joi";
import { AppError } from "../../../../../application/errors/app-error.js";

const registrationSchema = Joi.object({
    rideId: Joi.string().uuid().required(),
    subscriptionDate: Joi.date().required(),
});

export class RegistrationRideController {
    static dependencies = {};

    static configure(dependencies) {
        RegistrationRideController.dependencies = {
            ...RegistrationRideController.dependencies,
            ...dependencies,
        };
    }
    
    static async create(request, reply) {
        const { validator, createUseCaseFactory } = RegistrationRideController.dependencies;
        if (!validator || !createUseCaseFactory) {
            throw new AppError("RegistrationRideController dependencies are not configured.", { code: "CONTROLLER_NOT_CONFIGURED", statusCode: 500 });
        }
        const cyclistId = request.user.sub;
        const { rideId, subscriptionDate } = validator.validate(registrationSchema, request.body);
        const registrationRideUseCase = createUseCaseFactory();
        
        const { registrationRide } = await registrationRideUseCase.execute({ rideId, cyclistId, subscriptionDate });

        return reply.status(201).send({ registrationRide });
    }

    static async findById(request, reply) {
        const { listUseCaseFactory, cacheRepositoryFactory } = RegistrationRideController.dependencies;
        if (!listUseCaseFactory || !cacheRepositoryFactory) {
            throw new AppError("RegistrationRideController dependencies are not configured.", { code: "CONTROLLER_NOT_CONFIGURED", statusCode: 500 });
        }
        const cyclistId = request.user.sub;
        const redisCache = cacheRepositoryFactory();
        const registrationIsCached = await redisCache.existsDataInCache(`registration-${cyclistId}`);
        
        if(registrationIsCached) {
            return reply.status(200).send({ registrationRide: registrationIsCached });
        }

        const listRegistrationRideUseCase = listUseCaseFactory();

        const { registrationRide }  = await listRegistrationRideUseCase.execute(cyclistId);
        await redisCache.addInCache(`registration-${cyclistId}`, registrationRide)

        return reply.status(200).send({ registrationRide });
    }
}
