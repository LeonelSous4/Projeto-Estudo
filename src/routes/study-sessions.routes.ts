
import { Router } from "express";

import { StudySessionController } from "@/controllers/studySessions.controllers";

const studySessionsRoutes = Router()
const studySessionController = new StudySessionController()


studySessionsRoutes.post("/", studySessionController.create);
studySessionsRoutes.get("/",studySessionController.index);
studySessionsRoutes.get("/:id", studySessionController.show);

studySessionsRoutes.patch("/:id/pause", studySessionController.pause);
studySessionsRoutes.patch("/:id/resume", studySessionController.resume);
studySessionsRoutes.patch("/:id/finish", studySessionController.finish);

studySessionsRoutes.delete("/:id", studySessionController.delete);

export { studySessionsRoutes }