import { prisma } from "../../connection/prisma.js"
import { RegistrationRidesRepository } from "../../../../application/repositories/registartion-ride-repository.js"

class PrismaRegistrationRidesRepository extends RegistrationRidesRepository {
    
    async create(propsRegistrationRide) {
        const registrationRides = await prisma.registrationRide.create({
            data: {
                ride_id: propsRegistrationRide.rideId ,
                cyclist_id: propsRegistrationRide.cyclistId,
                subscription_date: propsRegistrationRide.subscriptionDate,
            }
        });

        return registrationRides;
    }

    async listRegistrationRidesByCyclitId(cyclistId) {
        const registrationRides = await prisma.registrationRide.findMany({
            where: {
                id: cyclistId,
            }
        });

        return registrationRides;
    }
}

export { PrismaRegistrationRidesRepository }