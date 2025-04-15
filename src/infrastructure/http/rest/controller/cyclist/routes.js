import { CyclistController } from "./cyclist-controller.js"

export async function cyclistRoutes(appInstance) {
    appInstance.post("/cyclists", CyclistController.create);
    appInstance.get("/cyclists", CyclistController.fetch)
}