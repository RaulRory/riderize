import { RegistrationsRide } from "../../src/domain//registrationsRide.js"
import { faker } from "@faker-js/faker"

function makeRegistrationRide(argumentsRegistrationRide) {
    const registrationRide = new RegistrationsRide({
        id: faker.string.uuid(),
        rideId: faker.string.uuid(),
        cyclistId: faker.string.uuid(),
        subscriptionDate: faker.date.recent(),
        ...argumentsRegistrationRide,
    })

    return registrationRide;
}

export { makeRegistrationRide }