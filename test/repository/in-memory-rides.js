import { RidesRepository } from "../../src/application/repositories/ride-repository.js"

class RidesInMemoryRepository extends RidesRepository {
    rides = [];

    async create(propsRides) {
        this.rides.push(propsRides)
    }

    async findById(rideId) {
        const ride = this.rides.find((item) => item.id === rideId);
        
        if (!ride) {
            return null
        }
      
        return ride;
    }
}

export { RidesInMemoryRepository }