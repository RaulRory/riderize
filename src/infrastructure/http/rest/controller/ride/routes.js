import { verifyJwt } from "../../middleware/verify-jwt.js";
import { RideController } from "./ride-controller.js";

export async function rideRoutes(appInstance) {
    appInstance.addHook("onRequest", verifyJwt)

    appInstance.post("/ride",  RideController.create)
    appInstance.get("/ride/:id", RideController.findById)
}