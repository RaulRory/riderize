import { ListRegistrationRidesUseCase } from "../../../../application/use-case/list-registration-rides.js";
import { PrismaRegistrationRidesRepository } from "../../../database/prisma/repository/prisma-registration-ride-reppository.js";

export function makeListRegistrationRideUseCase() {
    return new ListRegistrationRidesUseCase(new PrismaRegistrationRidesRepository())
}
