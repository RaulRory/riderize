export const schema =`
    scalar DateTime
    
    type Query {
        cyclist: [Cyclist]
        ride(id: ID!): Ride
        registrationRide(id: ID!): [RegistrationRide]
    }

    type Mutation {
        createCyclist(name: String!, email: String!, password: String!): Cyclist
        createRide(
            name: String!,
            starDate: DateTime!,
            starDateRegistration: DateTime!,
            endDateRegistration: DateTime!,
            startPlace: String!,
            additionalInformation: String,
            participantsLimit: Int
        ): Ride
        createRegistrationRide(rideId: ID!, cyclistId: ID!, subscriptionDate: DateTime!): RegistrationRide
    }

    type RegistrationRide {
        id: ID!,
        rideId: ID!,
        cyclistId: ID!,
        subscriptionDate: DateTime!
    }

    type Cyclist {
        id: ID!
        name: String!
        email: String!
    }

    type Ride {
        id: ID!
        name: String!
        starDate: DateTime! 
        starDateRegistration: DateTime!
        endDateRegistration: DateTime!
        startPlace: String!
        additionalInformation: String
        participantsLimit: Int
    }  
`;
