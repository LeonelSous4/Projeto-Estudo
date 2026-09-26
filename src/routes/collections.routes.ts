
import { Router } from "express";

import { colectionsController } from "@/controllers/collections.controllers";

const collectionsRoutes = Router()
const collectionsController = new colectionsController()


collectionsRoutes.get("/", collectionsController.index);
collectionsRoutes.post("/", () => {});
collectionsRoutes.get("/:id", () => {});
collectionsRoutes.put("/:id", () => {});
collectionsRoutes.delete("/:id", () => {});

export { collectionsRoutes}



