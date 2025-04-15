import { prisma } from "../../connection/prisma.js"
import { CyclistsRepository } from "../../../../application/repositories/cyclists-repositoriy.js";

class PrismaCyclistsRepository extends CyclistsRepository {
    
    async create(propsCyclist) {
        const cyclist = await prisma.cyclist.create({
            data: {
                name: propsCyclist.name,
                email: propsCyclist.email,
                password: propsCyclist.password,
            }
        });

        return cyclist;
    }

    async listCyclits() {
        const cyclists = await prisma.cyclist.findMany();
        return cyclists;
    }
}

export { PrismaCyclistsRepository }