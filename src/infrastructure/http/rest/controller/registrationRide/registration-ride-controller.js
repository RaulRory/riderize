import { CacheRepository } from "../../../../database/redis/redis-repository.js";
import { makeListRegistrationRideUseCase } from "../../factories/makeListRegistrationRideUseCase.js";
import { makeRegistrationRideUseCase } from "../../factories/makeRegistrationRideUseCase.js";
import { JoiValidatorAdapter } from "../../libs/joi.js";
import Joi from "joi";

const registrationSchema = Joi.object({
    cyclistId: Joi.string().uuid().required(),
    rideId: Joi.string().uuid().required(),
    subscriptionDate: Joi.date().required(),
});

export class RegistrationRideController {
    static dependencies = {
        validator: new JoiValidatorAdapter(),
        createUseCaseFactory: makeRegistrationRideUseCase,
        listUseCaseFactory: makeListRegistrationRideUseCase,
        cacheRepositoryFactory: () => new CacheRepository(),
    };

    static configure(dependencies) {
        this.dependencies = {
            ...this.dependencies,
            ...dependencies,
        };
    }
    
    static async create(request, reply) {
        try {
            const { validator, createUseCaseFactory } = this.dependencies;
            const { cyclistId, rideId, subscriptionDate } = validator.validate(registrationSchema, request.body);
            const registrationRideUseCase = createUseCaseFactory();
            
            const { registrationRide } = await registrationRideUseCase.execute({ rideId, cyclistId, subscriptionDate });


            return reply.status(201).send({ registrationRide });
        } catch (error) {
            throw new Error("Error Controller")
        }
    }

    static async findById(request, reply) {
        try {
            const { listUseCaseFactory, cacheRepositoryFactory } = this.dependencies;
            const cyclistId = request.user.sub;
            const redisCache = cacheRepositoryFactory();
            const registrationIsCached = await redisCache.existsDataInCache(`registration-${cyclistId}`);
            
            if(registrationIsCached) {
                return reply.status(200).send({ ride: registrationIsCached });
            }

            const listRegistrationRideUseCase = listUseCaseFactory();
    
            const { registrationRide }  = await listRegistrationRideUseCase.execute(cyclistId);
            await redisCache.addInCache(`registration-${cyclistId}`, registrationRide)

            return reply.status(200).send({ registrationRide });
        } catch (error) {
            console.error(error);
            throw new Error("Error Controller")
        }
    }
}
