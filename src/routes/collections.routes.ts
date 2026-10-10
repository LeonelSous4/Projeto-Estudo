
import { Router } from "express";

import { CollectionsController } from "@/controllers/collections.controllers";

const collectionsRoutes = Router()
const collectionsController = new CollectionsController()


collectionsRoutes.get("/", collectionsController.index);
collectionsRoutes.post("/", () => {});
collectionsRoutes.get("/:id", () => {});
collectionsRoutes.put("/:id", () => {});
collectionsRoutes.delete("/:id", () => {});

export { collectionsRoutes}



