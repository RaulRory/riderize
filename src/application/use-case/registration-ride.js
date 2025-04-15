import { RegistrationsRide } from "../../domain/registrationsRide.js";

class RegistrationRidesUseCase {
    #registrationRideRepository;
    #rideRepository;

    constructor(registrationRideRepository, rideRepository) {
        this.#registrationRideRepository = registrationRideRepository;
        this.#rideRepository = rideRepository;
    }

    async execute({ rideId, cyclistId, subscriptionDate }) {
        const ride = await this.#rideRepository.findById(rideId);

        if(!ride) {
            throw new Error("ride not found.")
        }

        if(ride.endDateRegistration.getDate() < subscriptionDate.getDate()) {
            throw new Error("You cannot sign up for this ride.")
        }

        const argumentsRegistrationRide = {
            rideId,
            cyclistId,
            subscriptionDate
        }
        
        const registrationRide = new RegistrationsRide(argumentsRegistrationRide);
        
        await this.#registrationRideRepository.create(registrationRide);

        return {
            registrationRide
        }
    }
}

export { RegistrationRidesUseCase }