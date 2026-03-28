import { JoiValidator } from "../../libs/joi.js";
import { makeCreateRideUseCase } from "../../factories/makeCreateRideUseCase.js";
import { makeFindRideBydIdUseCase } from "../../factories/makeFindRideByIdUseCase.js";
import { CacheRepository } from "../../../../database/redis/redis-repository.js";
import Joi from "joi";

const createRideSchema = Joi.object({
    name: Joi.string().trim().min(3).required(),
    starDate: Joi.date().required(),
    starDateRegistration: Joi.date().required(),
    endDateRegistration: Joi.date().required(),
    startPlace: Joi.string().trim().required(),
    additionalInformation: Joi.string().allow(null, "").optional(),
    participantsLimit: Joi.number().integer().positive().optional(),
});

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
            } = JoiValidator.validateSchema(createRideSchema, request.body);

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
            const rideIsCached = await redisCache.existsDataInCache(`ride-${id}`);
            
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
