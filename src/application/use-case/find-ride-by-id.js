class FindRideByIdUseCase {
    #repository;

    constructor(repository) {
        this.#repository = repository
    }

    async execute(id) {

        const ride = await this.#repository.findById(id);

        if(!ride) {
            throw new Error("Ride not found!")
        }

        return {
            ride
        }
    }
}

export { FindRideByIdUseCase }