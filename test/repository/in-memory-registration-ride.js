import { RegistrationRidesRepository } from "../../src/application/repositories/registartion-ride-repository.js"

class RegistrationRidesInMemoryRepository extends RegistrationRidesRepository  {
    registrationRides = [];

    async create(propsRegistrationRide) {
        this.registrationRides.push(propsRegistrationRide)
    }

    async listRegistrationRidesByCyclitId(cyclistId) {
        const registrationRide = this.registrationRides.filter((item) => item.cyclistId === cyclistId);
        
        if (!registrationRide) {
            return null
        }
      
        return registrationRide;
    }
}

export { RegistrationRidesInMemoryRepository }