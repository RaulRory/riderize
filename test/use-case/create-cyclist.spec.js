import { strictEqual } from "node:assert"
import { it, beforeEach, describe } from "node:test"
import { CyclistsInMemoryRepository } from "../repository/in-memory-cyclists.js";
import { CreateCyclistUseCase } from "../../src/application/use-case/create-cyclist.js";
import { makeCyclists } from "../factory/make-cyclists.js";

describe("Create Cyclist", () => {
    let useCase = {};
    let respository = {};

    // arange
    beforeEach(() => {
        respository = new CyclistsInMemoryRepository();
        useCase = new CreateCyclistUseCase(respository);
    });

    it("Shloud be able create cyclist", async () => {
        // arange
        const nameExpected = "Rory Teste";
        const cyclist = makeCyclists({ name: nameExpected }) 

        // action
        await useCase.execute(cyclist);

        // assert
        strictEqual(respository.cyclists[0].name, nameExpected);
        strictEqual(respository.cyclists[0].isLogued, false);
    })

    it("Shloud be able create cyclist is logued", async () => {
        // arange
        const nameExpected = "Rory Teste";
        const cyclistCreated = makeCyclists({ name: nameExpected })

        const { cyclist } = await useCase.execute(cyclistCreated);

        // action
        cyclist.isLogued = true;

        // assert
        strictEqual(respository.cyclists[0].isLogued, true);
    })
});