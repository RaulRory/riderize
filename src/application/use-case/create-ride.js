import { Rides } from "../../domain/rides.js";

class CreateRideUseCase {
    #repository;

    constructor(repository) {
        this.#repository = repository;
    }

    async execute({ name, starDate, starDateRegistration, endDateRegistration, startPlace, additionalInformation, participantsLimit }) {
        const newRides = new Rides({ name, starDate, starDateRegistration, endDateRegistration, startPlace, additionalInformation, participantsLimit });

        await this.#repository.create(newRides);

        return {
            ride: newRides 
        }
    }
}

export { CreateRideUseCase }