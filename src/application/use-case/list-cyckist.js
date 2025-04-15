class ListCyclistUseCase {
    #repository;

    constructor(repository) {
        this.#repository = repository
    }

    async execute() {
        const listCyclists = await this.#repository.listCyclits();

        if(listCyclists.length === 0) {
            throw new Error("Cyclist not found!")
        }

        return {
            cyclist: listCyclists,
        }
    }
}

export { ListCyclistUseCase }