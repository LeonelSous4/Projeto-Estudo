

import { Router } from "express";

import { NotebookController } from "@/controllers/notebook.controllers";

const notebooksRoutes = Router()
const notebookController = new NotebookController()


notebooksRoutes.get("/",notebookController.index);
notebooksRoutes.post("/", notebookController.create);
notebooksRoutes.get("/:id", notebookController.show);
notebooksRoutes.put("/:id", notebookController.update);
notebooksRoutes.delete("/:id", notebookController.delete);

export { notebooksRoutes}
