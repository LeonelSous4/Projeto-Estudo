
import { Router } from "express";

import { CollectionsController } from "@/controllers/collections.controllers";

const collectionsRoutes = Router()
const collectionsController = new CollectionsController()


collectionsRoutes.get("/",collectionsController.index);
collectionsRoutes.post("/", collectionsController.create);
collectionsRoutes.get("/:id", collectionsController.show);
collectionsRoutes.put("/:id", collectionsController.update);
collectionsRoutes.delete("/:id", collectionsController.delete);

export { collectionsRoutes}



