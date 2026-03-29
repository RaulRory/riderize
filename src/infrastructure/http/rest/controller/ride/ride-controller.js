import Joi from "joi";
import { AppError } from "../../../../../application/errors/app-error.js";

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
    static dependencies = {};

    static configure(dependencies) {
        RideController.dependencies = {
            ...RideController.dependencies,
            ...dependencies,
        };
    }

    static async create(request, reply) {
        const { validator, createUseCaseFactory } = RideController.dependencies;
        if (!validator || !createUseCaseFactory) {
            throw new AppError("RideController dependencies are not configured.", { code: "CONTROLLER_NOT_CONFIGURED", statusCode: 500 });
        }
        
        const {
            name,
            starDate,
            starDateRegistration,
            endDateRegistration,
            startPlace,
            additionalInformation,
            participantsLimit
        } = validator.validate(createRideSchema, request.body);

        const createRideUseCase = createUseCaseFactory();

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
    }

    static async findById(request, reply) {
        const { findByIdUseCaseFactory, cacheRepositoryFactory } = RideController.dependencies;
        if (!findByIdUseCaseFactory || !cacheRepositoryFactory) {
            throw new AppError("RideController dependencies are not configured.", { code: "CONTROLLER_NOT_CONFIGURED", statusCode: 500 });
        }
        const { id } = request.params;

        const redisCache = cacheRepositoryFactory();
        const rideIsCached = await redisCache.existsDataInCache(`ride-${id}`);
        
        if(rideIsCached) {
            return reply.status(200).send({ ride: rideIsCached });
        }

        const findRideByid = findByIdUseCaseFactory();
        const ride = await findRideByid.execute(id);
        
        await redisCache.addInCache(`ride-${id}`, ride)

        return reply.status(200).send({ ride });
    }
}

export { RideController }
