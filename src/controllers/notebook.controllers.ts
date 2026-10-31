import { NextFunction, Request, Response } from "express";
import { db } from "@/database/knex";
import { AppError } from "@/utils/AppError";
import { z } from "zod";

class NotebookController {
    async create(request: Request, response: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                name: z.string().trim().min(1, "O nome do notebook é obrigatório!"),
                collection_id: z.number().int().positive("O ID da coleção é obrigatório!"),
            });
            const { name, collection_id } = bodySchema.parse(request.body);

            const collection = await db("collections")
                .where({ id: collection_id })
                .first();

            if (!collection) {
                throw new AppError("Coleção não encontrada!", 404);
            }

            await db("notebooks").insert({ name, collection_id });

            return response.status(201).json({ message: "ok", name });
        } catch (error) {
            next(error);
        }
    }

    async index(request: Request, response: Response, next: NextFunction) {
        try {
            const { collection_id } = request.query;

            const query = db("notebooks");
            


            if (collection_id) {
                query.where({ collection_id: Number(collection_id) });
            }

            const notebooks = await query;
            return response.json(notebooks);
        } catch (error) {
            next(error);
        }
    }

    async show(request: Request, response: Response, next: NextFunction) {
        try {
            const id = Number(request.params.id);

            const notebook = await db("notebooks").where({ id }).first();

            if (!notebook) {
                throw new AppError("Notebook não encontrado.", 404);
            }

            return response.status(200).json({ notebook });
        } catch (error) {
            next(error);
        }
    }

    async update(request: Request, response: Response, next: NextFunction) {
        try {
            const id = Number(request.params.id);

            const bodySchema = z.object({
                name: z.string().trim().min(1, "O nome do notebook é obrigatório!"),
            });
            const { name } = bodySchema.parse(request.body);

            const notebook = await db("notebooks").where({ id }).first();

            if (!notebook) {
                throw new AppError("Notebook não encontrado.", 404);
            }

            await db("notebooks")
                .where({ id })
                .update({
                    name,
                    updated_at: db.fn.now(),
                });

            return response.status(200).json({ message: "Notebook atualizado com sucesso!" });
        } catch (error) {
            next(error);
        }
    }

    async delete(request: Request, response: Response, next: NextFunction) {
        try {
            const id = Number(request.params.id);

            const notebook = await db("notebooks").where({ id }).first();

            if (!notebook) {
                throw new AppError("Notebook não encontrado.", 404);
            }

            await db("notebooks").where({ id }).delete();

            return response.status(200).json({ message: "Notebook deletado com sucesso!" });
        } catch (error) {
            next(error);
        }
    }
}

export { NotebookController };
