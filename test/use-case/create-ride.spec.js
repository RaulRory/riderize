import { equal, strictEqual } from "node:assert"
import { it, beforeEach, describe } from "node:test"
import { makeRides }  from "../factory/make-rides.js"
import {  CreateRideUseCase} from "../../src/application/use-case/create-ride.js";
import { RidesInMemoryRepository } from "../repository/in-memory-rides.js";

describe("Create Rides", () => {
    let useCase = {};
    let respository = {};

    // arange
    beforeEach(() => {
        respository = new RidesInMemoryRepository();
        useCase = new CreateRideUseCase(respository);
    });

    it("Should be able create a ride", async () => {
        // arange
        const rideCreate = {
            name: "first Ride"
        }
        const ride = makeRides(rideCreate)

        // action
        await useCase.execute(ride);

        // assert
        equal(respository.rides[0].name, rideCreate.name);
    });

    it("Should be able create a ride with participantsLimit", async () => {
        // arange
        const rideCreate = {
            participantsLimit: 5
        }
        const ride = makeRides(rideCreate)

        // action
        await useCase.execute(ride);

        // assert
        equal(respository.rides[0].participantsLimit, rideCreate.participantsLimit);
    });

    it("Should be able create a ride with additionalInformation", async () => {
        // arange
        const rideCreate = {
            additionalInformation: "Test arguments"
        }
        const ride = makeRides(rideCreate)

        // action
        await useCase.execute(ride);

        // assert
        equal(respository.rides[0].additionalInformation, rideCreate.additionalInformation);
    });

    it("Should be able create a ride with no additionalInformation and participantsLimit", async () => {
        // arange
        const ride = makeRides();

        // action
        await useCase.execute(ride);

        // assert
        strictEqual(respository.rides[0].participants, undefined);
        strictEqual(respository.rides[0].additionalInformation, undefined);
    });
});