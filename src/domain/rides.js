import { randomUUID } from "node:crypto";

class Rides {
    #id;
    #name;
    #starDate;
    #starDateRegistration;
    #endDateRegistration;
    #startPlace;
    #additionalInformation;
    #participantsLimit;

    constructor({ name, starDate, starDateRegistration, endDateRegistration, startPlace, additionalInformation = undefined, participantsLimit = undefined, id = randomUUID() }) {
        this.#id = id;
        this.#name = name;
        this.#starDate = starDate;
        this.#starDateRegistration = starDateRegistration;
        this.#endDateRegistration = endDateRegistration;
        this.#startPlace = startPlace;
        this.#additionalInformation = additionalInformation;
        this.#participantsLimit = participantsLimit;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get starDate() {
        return this.#starDate;
    }

    get starDateRegistration() {
        return this.#starDateRegistration;
    }

    get endDateRegistration() {
        return this.#endDateRegistration;
    }

    get startPlace() {
        return this.#startPlace;
    }

    get additionalInformation() {
        return this.#additionalInformation;
    }

    get participantsLimit() {
        return this.#participantsLimit;
    }

}

export { Rides }