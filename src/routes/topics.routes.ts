import { Router } from "express";
import { TopicsController } from "@/controllers/topics.controllers";

const topicsRoutes = Router();
const topicsController = new TopicsController();

topicsRoutes.get("/", topicsController.index);
topicsRoutes.post("/", topicsController.create);
topicsRoutes.get("/:id", topicsController.show);
topicsRoutes.put("/:id", topicsController.update);
topicsRoutes.delete("/:id", topicsController.delete);

// Rota especial do Checklist: marcar / desmarcar como concluído
topicsRoutes.patch("/:id/toggle", topicsController.toggle);

export { topicsRoutes };