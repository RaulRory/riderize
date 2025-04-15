import { CreateCyclistUseCase } from "../../../../application/use-case/create-cyclist.js";
import { PrismaCyclistsRepository } from "../../../database/prisma/repository/prisma-cyclist-repository.js";

export function makeCreateCyclyitUseCase() {
    return  new CreateCyclistUseCase(new PrismaCyclistsRepository());
}