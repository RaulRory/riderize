import { prisma } from "../../connection/prisma.js"
import { RidesRepository } from "../../../../application/repositories/ride-repository.js"

class PrismaRidesRepository extends RidesRepository {
    
    async create(propsRides) {
        const ride = await prisma.ride.create({
            data: {
                name: propsRides.name,
                start_date: propsRides.starDate,
                start_date_registration: propsRides.starDateRegistration,
                end_date_registration: propsRides.endDateRegistration,
                start_place: propsRides.startPlace,
                additional_information: propsRides.additionalInformation,
                participants_limit: propsRides.participantsLimit
            }
        });
        return ride;
    }

    async findById(rideId) {
        const ride = await prisma.ride.findUnique({
            where: {
                id: rideId,
            }
        });

        return ride;
    }
}

export { PrismaRidesRepository }