import { FindRideByIdUseCase } from "../../../../application/use-case/find-ride-by-id.js";
import { PrismaRidesRepository } from "../../../database/prisma/repository/prisma-ride-repository.js";

export function makeFindRideBydIdUseCase() {
    return new FindRideByIdUseCase(new PrismaRidesRepository());
}