import { JoiValidator } from "../../libs/joi.js";
import { makeCreateRideUseCase } from "../../factories/makeCreateRideUseCase.js";
import { makeFindRideBydIdUseCase } from "../../factories/makeFindRideByIdUseCase.js";
import { CacheRepository } from "../../../../database/redis/redis-repository.js";

class RideController {
    static async create(request, reply) {
        try {
            
            const { 
                name, 
                starDate, 
                starDateRegistration, 
                endDateRegistration, 
                startPlace, 
                additionalInformation, 
                participantsLimit 
            } = JoiValidator.validateSchema(request.body);

            const createRideUseCase = makeCreateRideUseCase();
    
            await createRideUseCase.execute({
                name, 
                starDate, 
                starDateRegistration, 
                endDateRegistration, 
                startPlace, 
                additionalInformation, 
                participantsLimit
            });

            return reply.status(201).send({});
        } catch (error) {
            console.error(error);
            throw new Error("Error Controller")
        }
    }

    static async findById(request, reply) {
        try {
            const { id } = request.params;

            const redisCache = new CacheRepository();
            const rideIsCached = redisCache.existsDataInCache(`ride-${id}`);
            
            if(rideIsCached) {
                return reply.status(200).send({ ride: rideIsCached });
            }

            const findRideByid = makeFindRideBydIdUseCase();
            const ride = await findRideByid.execute(id);
            
            await redisCache.addInCache(`ride-${id}`, ride)

            return reply.status(200).send({ ride });
        } catch (error) {
            console.error(error);
            throw new Error("Error Controller")
        }
    }
}

export { RideController }