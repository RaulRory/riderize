import { randomUUID } from "node:crypto";

class RegistrationsRide {
    #id;
    #rideId;
    #cyclistId;
    #subscriptionDate;

    constructor({ rideId, cyclistId, subscriptionDate, id = randomUUID() }) {
        this.#id = id
        this.#rideId = rideId;
        this.#cyclistId = cyclistId;
        this.#subscriptionDate = subscriptionDate
    }

    get id() {
        return this.#id;
    }

    get rideId() {
        return this.#rideId;
    }

    get cyclistId() {
        return this.#cyclistId;
    }

    get subscriptionDate() {
        return this.#subscriptionDate;
    }
}

export { RegistrationsRide }