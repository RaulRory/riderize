import { Cyclists } from "../../domain/cyclists.js"

class CreateCyclistUseCase {
    #repository;

    constructor(repository) {
        this.#repository = repository;
    }

    async execute({ name, email, password }) {
        const cyclist = new Cyclists({ name, email, password });

        await this.#repository.create(cyclist);

        return {
            cyclist,
        }
    }
}

export { CreateCyclistUseCase }