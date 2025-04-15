class ListRegistrationRidesUseCase {
    #repository;

    constructor(repository) {
        this.#repository = repository
    }

    async execute(cyclistId) {
        const listRegistrationRides = await this.#repository.listRegistrationRidesByCyclitId(cyclistId);

        if(listRegistrationRides.length === 0) {
            throw new Error("Cyclist not found!")
        }

        return {
            registrationRide: listRegistrationRides,
        }
    }
}

export { ListRegistrationRidesUseCase }