import { NextFunction, Request, Response } from "express";
import { db } from "@/database/knex";
import { AppError } from "@/utils/AppError";
import { z } from "zod";

class TopicsController {
    // 1. CRIAR TÓPICO (com resumo/anotações opcionais)
    async create(request: Request, response: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                name: z.string().trim().min(1, "O nome do tópico é obrigatório!"),
                notebook_id: z.number().int().positive("O ID do caderno é obrigatório!"),
                content: z.string().optional(), // Aqui entram os resumos / anotações
            });

            const { name, notebook_id, content } = bodySchema.parse(request.body);

            // Verifica se o caderno "pai" existe
            const notebook = await db("notebooks").where({ id: notebook_id }).first();
            if (!notebook) {
                throw new AppError("Caderno não encontrado!", 404);
            }

            await db("topics").insert({
                name,
                notebook_id,
                content: content || null,
            });

            return response.status(201).json({ message: "Tópico criado com sucesso!" });
        } catch (error) {
            next(error);
        }
    }

    // 2. LISTAR TÓPICOS (filtrando por caderno)
    async index(request: Request, response: Response, next: NextFunction) {
        try {
            const { notebook_id } = request.query;

            const query = db("topics");

            if (notebook_id) {
                query.where({ notebook_id });
            }

            const topics = await query;
            return response.json(topics);
        } catch (error) {
            next(error);
        }
    }

    // 3. MOSTRAR UM TÓPICO ESPECÍFICO (com o resumo completo)
    async show(request: Request, response: Response, next: NextFunction) {
        try {
            const { id } = request.params;

            const topic = await db("topics").where({ id }).first();
            if (!topic) {
                throw new AppError("Tópico não encontrado!", 404);
            }

            return response.json(topic);
        } catch (error) {
            next(error);
        }
    }

    // 4. ATUALIZAR TÓPICO (editar nome ou editar o resumo)
    async update(request: Request, response: Response, next: NextFunction) {
        try {
            const { id } = request.params;

            const bodySchema = z.object({
                name: z.string().trim().min(1, "O nome do tópico é obrigatório!"),
                content: z.string().optional(),
            });

            const { name, content } = bodySchema.parse(request.body);

            const topic = await db("topics").where({ id }).first();
            if (!topic) {
                throw new AppError("Tópico não encontrado!", 404);
            }

            await db("topics").where({ id }).update({
                name,
                content: content !== undefined ? content : topic.content,
                updated_at: db.fn.now(),
            });

            return response.json({ message: "Tópico atualizado com sucesso!" });
        } catch (error) {
            next(error);
        }
    }

    // 5. DELETAR TÓPICO
    async delete(request: Request, response: Response, next: NextFunction) {
        try {
            const { id } = request.params;

            const topic = await db("topics").where({ id }).first();
            if (!topic) {
                throw new AppError("Tópico não encontrado!", 404);
            }

            await db("topics").where({ id }).delete();

            return response.json({ message: "Tópico deletado com sucesso!" });
        } catch (error) {
            next(error);
        }
    }

    // 6. O DIFERENCIAL DO CHECKLIST: Marcar/Desmarcar com um clique (TOGGLE)
    async toggle(request: Request, response: Response, next: NextFunction) {
        try {
            const { id } = request.params;

            const topic = await db("topics").where({ id }).first();
            if (!topic) {
                throw new AppError("Tópico não encontrado!", 404);
            }

            // Inverte o booleano: se estava false vira true; se estava true vira false!
            const newStatus = !topic.is_completed;

            await db("topics").where({ id }).update({
                is_completed: newStatus,
                updated_at: db.fn.now(),
            });

            return response.json({
                message: newStatus ? "Tópico concluído! Parabéns!" : "Tópico desmarcado como pendente.",
                is_completed: newStatus,
            });
        } catch (error) {
            next(error);
        }
    }
}

export { TopicsController };