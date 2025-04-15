import { verifyJwt } from "../../middleware/verify-jwt.js";
import { RegistrationRideController } from "./registration-ride-controller.js";


export async function registrationRideRoutes(appInstance) {
    appInstance.addHook("onRequest", verifyJwt)

    appInstance.post("registration/ride",  RegistrationRideController.create)
    appInstance.get("registration/ride", RegistrationRideController.findById)
}