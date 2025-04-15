import { parse } from "graphql";

export async function verifyJwt(request, reply ) {
	try {
		await request.jwtVerify();
	} catch (error) {
		return reply.status(401).send({ message: "Unauthorized" });
	}
}

export async function verifyJwtGraphQL(request) {
	const requestGraphqlWithJWT = ["createRide", "createRegistrationRide", "ride", "registrationRide", "cyclist"];
	const  queryGraphql = parse(request.body.query)
	const operationName = queryGraphql.definitions[0].selectionSet.selections[0].name.value|| null;

	return requestGraphqlWithJWT.includes(operationName);
}