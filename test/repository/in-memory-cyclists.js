import { CyclistsRepository } from "../../src/application/repositories/cyclists-repository.js"

class CyclistsInMemoryRepository extends CyclistsRepository {
    cyclists = [];

    async create(cyclist) {
        this.cyclists.push(cyclist)
    }
}

export { CyclistsInMemoryRepository }