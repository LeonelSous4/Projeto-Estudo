import { Router } from "express";
import { collectionsRoutes } from "./collections.routes";
import { notebooksRoutes } from "./notebooks.routes";
import { topicsRoutes } from "./topics.routes";
import { studySessionsRoutes } from "./study-sessions.routes";
import { goalsRoutes } from "./goals.routes";


const routes = Router();


routes.use("/collections", collectionsRoutes);
routes.use("/notebooks", notebooksRoutes);
routes.use("/topics", topicsRoutes);
routes.use("/study-sessions", studySessionsRoutes);
routes.use("/goals", goalsRoutes);
export { routes };