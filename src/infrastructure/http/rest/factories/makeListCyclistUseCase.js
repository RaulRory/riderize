import { ListCyclistUseCase } from "../../../../application/use-case/list-cyclist.js"
import { PrismaCyclistsRepository } from "../../../database/prisma/repository/prisma-cyclist-repository.js";

export function makeListCyclistUseCase() {
    return  new ListCyclistUseCase(new PrismaCyclistsRepository());
}