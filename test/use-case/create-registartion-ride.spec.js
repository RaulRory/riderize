import { strictEqual, rejects } from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { makeRides } from "../factory/make-rides.js";
import { RidesInMemoryRepository } from "../repository/in-memory-rides.js";
import { makeRegistrationRide } from "../factory/make-registration-ride.js";
import { RegistrationRidesUseCase } from "../../src/application/use-case/registration-ride.js";
import { RegistrationRidesInMemoryRepository } from "../repository/in-memory-registration-ride.js";

describe("Registration Ride", () => {
  let useCase = {};
  let ridesRepository = {};
  let registrationRidesRepository = {};

  beforeEach(() => {
    ridesRepository = new RidesInMemoryRepository();
    registrationRidesRepository = new RegistrationRidesInMemoryRepository();
    useCase = new RegistrationRidesUseCase(
      registrationRidesRepository,
      ridesRepository
    );
  });

  it("should create a registration ride if subscription date is before the end date registration", async ({}) => {
    const rideIdTest = "ID-TEST";

    await ridesRepository.create(
      makeRides({ id: rideIdTest, endRegistrationDate: new Date("2023-10-10") })
    );
    const registrationRide = makeRegistrationRide({
      rideId: rideIdTest,
      subscriptionDate: new Date("2023-10-09"),
    });

    await useCase.execute(registrationRide);

    strictEqual(
      registrationRidesRepository.registrationRides[0].rideId,
      rideIdTest
    )

    strictEqual(
      registrationRide.subscriptionDate.getTime() <
      ridesRepository.rides[0].endDateRegistration.getTime(),
      true
    );
  });

  it("should throw an error when ride id is not found", async () => {
    const rideIdTest = "ID-TEST-ERROR";
    await ridesRepository.create(makeRides());
    const registrationRide = makeRegistrationRide({ rideId: rideIdTest });

    await rejects(async () => {
      await useCase.execute(registrationRide);
    }, new Error("ride not found."));
  });

  it("should throw an error if subscription date is after the end date registration", async () => {
    await ridesRepository.create(
      makeRides({ id: "ID_TEST", endDateRegistration: new Date("2023-10-10") })
    );
    const registrationRide = makeRegistrationRide({
      rideId: "ID_TEST",
      subscriptionDate: new Date("2023-10-11"),
    });

    await rejects(async () => {
      await useCase.execute(registrationRide);
    }, new Error("You cannot sign up for this ride."));
  });
});
