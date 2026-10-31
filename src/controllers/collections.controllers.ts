import { NextFunction, Request, Response } from "express";
import { db } from "@/database/knex";
import { AppError } from "@/utils/AppError";
import { z } from "zod";

class CollectionsController {
    async create(request: Request, response: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                name: z.string().trim().min(1, "O nome da coleção é obrigatório!"),
            });
            const { name } = bodySchema.parse(request.body);

            await db("collections").insert({ name });

            return response.status(201).json({ message: "ok", name });
        } catch (error) {
            next(error);
        }
    }

    async index(request: Request, response: Response, next: NextFunction) {
        try {
            const collections = await db("collections").select("*");
            return response.status(200).json({ collections });
        } catch (error) {
            next(error);
        }
    }

    async show(request: Request, response: Response, next: NextFunction) {
        try {
            const id = Number(request.params.id);

            const collection = await db("collections").where({ id }).first();

            if (!collection) {
                throw new AppError("Coleção não encontrada.", 404);
            }

            return response.status(200).json({ collection });
        } catch (error) {
            next(error);
        }
    }

    async update(request: Request, response: Response, next: NextFunction) {
        try {
            const id = Number(request.params.id);

            const bodySchema = z.object({
                name: z.string().trim().min(1, "O nome da coleção é obrigatório!"),
            });
            const { name } = bodySchema.parse(request.body);

            const collection = await db("collections").where({ id }).first();

            if (!collection) {
                throw new AppError("Coleção não encontrada.", 404);
            }

            await db("collections")
                .where({ id })
                .update({
                    name,
                    updated_at: db.fn.now(),
                });

            return response.status(200).json({ message: "Coleção atualizada com sucesso!" });
        } catch (error) {
            next(error);
        }
    }

    async delete(request: Request, response: Response, next: NextFunction) {
        try {
            const id = Number(request.params.id);

            const collection = await db("collections").where({ id }).first();

            if (!collection) {
                throw new AppError("Coleção não encontrada.", 404);
            }

            await db("collections").where({ id }).delete();

            return response.status(200).json({ message: "Coleção deletada com sucesso!" });
        } catch (error) {
            next(error);
        }
    }
}

export { CollectionsController };
