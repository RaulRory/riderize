
import Joi from "joi";

const cyclistSchema = Joi.object({
    name: Joi.string().trim().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

export class CyclistController {
    static dependencies = {};

    static configure(dependencies) {
        CyclistController.dependencies = {
            ...CyclistController.dependencies,
            ...dependencies,
        };
    }

    static async create(request, reply) {
        try {
            const { validator, createUseCaseFactory } = CyclistController.dependencies;
            if (!validator || !createUseCaseFactory) {
                throw new Error("CyclistController dependencies are not configured.");
            }
            const { name, email, password } = validator.validate(cyclistSchema, request.body);
    
            const createCyclistUseCase = createUseCaseFactory();
    
            const { cyclist } =  await createCyclistUseCase.execute({ name, email, password });

            const token = await reply.jwtSign({ 
                sign: { 
                    sub: cyclist.id
                }
            });
            
            return reply.status(201).send({ id: cyclist.id, name: cyclist.name, email: cyclist.email, token });
        } catch (error) {
            console.error(error);
            throw new Error("Error Controller")
        }
    }

    static async fetch(request, reply) {
        try {
            const { listUseCaseFactory, cacheRepositoryFactory } = CyclistController.dependencies;
            if (!listUseCaseFactory || !cacheRepositoryFactory) {
                throw new Error("CyclistController dependencies are not configured.");
            }
            const redisCache = cacheRepositoryFactory();
            const cyclistIsCached = await redisCache.existsDataInCache("cyclist");
            
            if(cyclistIsCached) {
                return reply.status(200).send({ cyclist: cyclistIsCached });
            }

            const listCyclistUseCase = listUseCaseFactory();
    
            const { cyclist } =  await listCyclistUseCase.execute()
            await redisCache.addInCache("cyclist", cyclist)

            return reply.status(200).send({ cyclist });
        } catch (error) {
            console.error(error);
            throw new Error("Error Controller")
        }
    }
}
