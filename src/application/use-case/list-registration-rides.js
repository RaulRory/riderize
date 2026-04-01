import { AppError } from "../errors/app-error.js";

class ListRegistrationRidesUseCase {
    #repository;

    constructor(repository) {
        this.#repository = repository
    }

    async execute(cyclistId) {
        const listRegistrationRides = await this.#repository.listRegistrationRidesByCyclistId(cyclistId);

        if(listRegistrationRides.length === 0) {
            throw new AppError("Cyclist not found!", { code: "CYCLIST_NOT_FOUND", statusCode: 404 })
        }

        return {
            registrationRide: listRegistrationRides,
        }
    }
}

export { ListRegistrationRidesUseCase }
