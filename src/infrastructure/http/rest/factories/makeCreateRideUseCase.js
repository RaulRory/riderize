import { CreateRideUseCase } from "../../../../application/use-case/create-ride.js";
import { PrismaRidesRepository } from "../../../database/prisma/repository/prisma-ride-repository.js";

export function makeCreateRideUseCase() {
    return  new CreateRideUseCase(new PrismaRidesRepository());
}
