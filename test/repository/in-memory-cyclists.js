import { CyclistsRepository } from "../../src/application/repositories/cyclists-repositoriy.js"

class CyclistsInMemoryRepository extends CyclistsRepository {
    cyclists = [];

    async create(cyclist) {
        this.cyclists.push(cyclist)
    }
}

export { CyclistsInMemoryRepository }