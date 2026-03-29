import fastify from "fastify";
import mercurius from "mercurius";
import fastifyJwt from "@fastify/jwt";
import { PrismaClient } from "@prisma/client";
import { schema } from "../graphQL/schema.js"
import { resolvers } from "../graphQL/resolvers.js";
import { cyclistRoutes } from "./controller/cyclist/routes.js";
import { rideRoutes } from "./controller/ride/routes.js";
import { registrationRideRoutes } from "./controller/registrationRide/routes.js";
import { verifyJwtGraphQL } from "./middleware/verify-jwt.js";
import { AppError } from "../../../application/errors/app-error.js";

const app = fastify();
const prisma = new PrismaClient();

app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET
});

app.register(mercurius, {
    schema,
    resolvers,
    context: async (request, reply) => {
        let user = null;

        const notAllowedRequestWithothJWT = await verifyJwtGraphQL(request);

        if (notAllowedRequestWithothJWT) {
            try {
                const decoded = await request.jwtVerify();
                user = decoded;
            } catch (err) {
                reply.code(401).send({ error: 'Unauthorized' });
            }
        }

        return { prisma, user }
    },
    graphql: true
});

app.register(cyclistRoutes, { prefix: '/api' });
app.register(rideRoutes, { prefix: '/api' });
app.register(registrationRideRoutes, { prefix: '/api' });

app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
            message: error.message,
            code: error.code,
            details: error.details ?? null,
        });
    }

    request.log.error(error);
    return reply.status(500).send({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
    });
});

export { app }
