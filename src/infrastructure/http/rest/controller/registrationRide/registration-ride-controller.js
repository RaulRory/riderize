import Joi from "joi";

const registrationSchema = Joi.object({
    cyclistId: Joi.string().uuid().required(),
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
        try {
            const { validator, createUseCaseFactory } = RegistrationRideController.dependencies;
            if (!validator || !createUseCaseFactory) {
                throw new Error("RegistrationRideController dependencies are not configured.");
            }
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
            const { listUseCaseFactory, cacheRepositoryFactory } = RegistrationRideController.dependencies;
            if (!listUseCaseFactory || !cacheRepositoryFactory) {
                throw new Error("RegistrationRideController dependencies are not configured.");
            }
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
