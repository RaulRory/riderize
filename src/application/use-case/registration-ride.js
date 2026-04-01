import { RegistrationsRide } from "../../domain/registrationsRide.js";
import { AppError } from "../errors/app-error.js";

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
            throw new AppError("ride not found.", { code: "RIDE_NOT_FOUND", statusCode: 404 })
        }

        if(ride.endDateRegistration.getTime() < subscriptionDate.getTime()) {
            throw new AppError("You cannot sign up for this ride.", { code: "REGISTRATION_CLOSED", statusCode: 409 })
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
