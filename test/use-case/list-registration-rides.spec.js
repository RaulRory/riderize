import { strictEqual, rejects } from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { RidesInMemoryRepository } from "../repository/in-memory-rides.js";
import { RegistrationRidesInMemoryRepository } from "../repository/in-memory-registration-ride.js";
import { makeRides } from "../factory/make-rides.js";
import { makeRegistrationRide } from "../factory/make-registration-ride.js";
import { ListRegistrationRidesUseCase } from "../../src/application/use-case/list-registration-rides.js";


describe("List Registration Rides", () => {
    let useCase = {};
    let ridesRepository = {};
    let registrationRidesRepository = {};

    beforeEach(() => {
        registrationRidesRepository = new RegistrationRidesInMemoryRepository()
        ridesRepository = new RidesInMemoryRepository();
        useCase = new ListRegistrationRidesUseCase(registrationRidesRepository);
    });

    it("Should be able list registrationsRides registration for a cyclist", async () => {
        const idRideTest = "ID-TEST";
        const idCyclistTest = "ID-CYCLIST-TEST";

        await Promise.all([
            ridesRepository.create(makeRides({ id: idRideTest  })),
            ridesRepository.create(makeRides({ id: idRideTest  })),
            ridesRepository.create(makeRides({ id: idRideTest  }))
        ]);

        await Promise.all([
            registrationRidesRepository.create(makeRegistrationRide({ rideId: idRideTest, cyclistId: idCyclistTest })),
            registrationRidesRepository.create(makeRegistrationRide({ rideId: idRideTest, cyclistId: idCyclistTest })),
        ]);

        const { registrationRide } = await useCase.execute(idCyclistTest)

        strictEqual(registrationRide.length, 2);
    });

    it("Should be able not list registrationsRides with cyclistId Error", async () => {
        const idCyclistTest = "ID-CYCLIST-ERROR";

        await Promise.all([
            await ridesRepository.create(makeRides()),
            await registrationRidesRepository.create(makeRegistrationRide()),
        ]);

        await rejects(async () => {
            await useCase.execute(idCyclistTest)
        }, 
        new Error("Cyclist not found!"))
    });
});