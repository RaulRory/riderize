import { CacheRepository } from "../../../../database/redis/redis-repository.js";
import { makeListRegistrationRideUseCase } from "../../factories/makeListRegistrationRideUseCase.js";
import { makeRegistrationRideUseCase } from "../../factories/makeRegistrationRideUseCase.js";
import { JoiValidator } from "../../libs/joi.js";

export class RegistrationRideController {
    
    static async create(request, reply) {
        try {
            const { cyclistId, rideId, subscriptionDate } = JoiValidator.validateSchema(request.body);
            const registrationRideUseCase = makeRegistrationRideUseCase();
            
            const { registrationRide } = await registrationRideUseCase.execute({ rideId, cyclistId, subscriptionDate });


            return reply.status(201).send({ registrationRide });
        } catch (error) {
            throw new Error("Error Controller")
        }
    }

    static async findById(request, reply) {
        try {
            const cyclistId = request.user.sub;
            const redisCache = new CacheRepository();
            const registrationIsCached = redisCache.existsDataInCache(`registration-${cyclistId}`);
            
            if(registrationIsCached) {
                return reply.status(200).send({ ride: registrationIsCached });
            }

            const listRegistrationRideUseCase = makeListRegistrationRideUseCase();
    
            const { registrationRide }  = await listRegistrationRideUseCase.execute(cyclistId);
            await redisCache.addInCache(`registration-${cyclistId}`, registrationRide)

            return reply.status(200).send({ registrationRide });
        } catch (error) {
            console.error(error);
            throw new Error("Error Controller")
        }
    }
}