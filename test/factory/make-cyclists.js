import { Cyclists } from "../../src/domain/cyclists.js";
import { faker } from "@faker-js/faker"

function makeCyclists(argumentsCyclist) {
    const cyclist = new Cyclists({
        name: faker.person.fullName(), 
        email: faker.internet.email(), 
        password: faker.internet.password(),
        ...argumentsCyclist,
    })

    return cyclist;
}

export { makeCyclists }