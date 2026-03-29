import { AppError } from "../errors/app-error.js";

class ListCyclistUseCase {
    #repository;

    constructor(repository) {
        this.#repository = repository
    }

    async execute() {
        const listCyclists = await this.#repository.listCyclits();

        if(listCyclists.length === 0) {
            throw new AppError("Cyclist not found!", { code: "CYCLIST_NOT_FOUND", statusCode: 404 })
        }

        return {
            cyclist: listCyclists,
        }
    }
}

export { ListCyclistUseCase }
