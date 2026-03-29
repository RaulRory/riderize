import { AppError } from "../errors/app-error.js";

class FindRideByIdUseCase {
    #repository;

    constructor(repository) {
        this.#repository = repository
    }

    async execute(id) {

        const ride = await this.#repository.findById(id);

        if(!ride) {
            throw new AppError("Ride not found!", { code: "RIDE_NOT_FOUND", statusCode: 404 })
        }

        return {
            ride
        }
    }
}

export { FindRideByIdUseCase }
