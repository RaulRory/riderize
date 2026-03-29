
import { JoiValidatorAdapter } from "../../libs/joi.js";
import { makeCreateCyclyitUseCase } from "../../factories/makeCreateCiclystUseCase.js";
import { makeListCyclistUseCase } from "../../factories/makeListCyclistUseCase.js";
import { CacheRepository } from "../../../../database/redis/redis-repository.js";
import Joi from "joi";

const cyclistSchema = Joi.object({
    name: Joi.string().trim().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

export class CyclistController {
    static dependencies = {
        validator: new JoiValidatorAdapter(),
        createUseCaseFactory: makeCreateCyclyitUseCase,
        listUseCaseFactory: makeListCyclistUseCase,
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
            const { listUseCaseFactory, cacheRepositoryFactory } = this.dependencies;
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
