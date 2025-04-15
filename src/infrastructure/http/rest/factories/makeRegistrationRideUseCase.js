
import { RegistrationRidesUseCase } from "../../../../application/use-case/registration-ride.js";
import { PrismaRegistrationRidesRepository } from "../../../database/prisma/repository/prisma-registration-ride-reppository.js";
import { PrismaRidesRepository } from "../../../database/prisma/repository/prisma-ride-repository.js";

export function makeRegistrationRideUseCase() {
    return new RegistrationRidesUseCase(new PrismaRegistrationRidesRepository(), new PrismaRidesRepository())
}