
import { JoiValidator } from "../../libs/joi.js";
import { makeCreateCyclyitUseCase } from "../../factories/makeCreateCiclystUseCase.js";
import { makeListCyclistUseCase } from "../../factories/makeListCyclistUseCase.js";
import { CacheRepository } from "../../../../database/redis/redis-repository.js";

export class CyclistController {
    static async create(request, reply) {
        try {
            const { name, email, password } = JoiValidator.validateSchema(request.body);
    
            const createCyclistUseCase = makeCreateCyclyitUseCase();
    
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
            const redisCache = new CacheRepository();
            const cyclistIsCached = redisCache.existsDataInCache("cyclist");
            
            if(cyclistIsCached) {
                return reply.status(200).send({ cyclist: cyclistIsCached });
            }

            const listCyclistUseCase = makeListCyclistUseCase();
    
            const { cyclist } =  await listCyclistUseCase.execute()
            await redisCache.addInCache("cyclist", cyclist)

            return reply.status(200).send({ cyclist });
        } catch (error) {
            console.error(error);
            throw new Error("Error Controller")
        }
    }
}
