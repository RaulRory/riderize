import { faker } from "@faker-js/faker"
import { Rides } from "../../src/domain/rides.js";

function makeRides(argumentsRides) {
    const ride = new Rides({
        id: faker.string.uuid(),
        name: faker.person.firstName(),
        starDate: faker.date.recent(),
        starDateRegistration: faker.date.recent(),
        endDateRegistration: faker.date.recent(),
        startPlace: faker.location.city(),
        ...argumentsRides
    });

    return ride;
}

export { makeRides };
