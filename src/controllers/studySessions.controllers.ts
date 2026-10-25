import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { db } from "@/database/knex";
import { AppError } from "@/utils/AppError";

const sessionIdSchema = z.object({
    id: z.coerce.number().int().positive(),
});

const sessionTypes = ["teoria", "questoes", "revisao"] as const;

export class StudySessionController {
    async create(request: Request, response: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                notebook_id: z.number().int().positive(),
                type: z.enum(sessionTypes),
            });
            const { notebook_id, type } = bodySchema.parse(request.body);

            const notebook = await db("notebooks").where({ id: notebook_id }).first();
            if (!notebook) {
                throw new AppError("Notebook não encontrado!", 404);
            }

            const [id] = await db("study_sessions").insert({
                notebook_id,
                type,
                duration_seconds: 0,
                status: "active",
                active_since: db.fn.now(),
            });

            const session = await db("study_sessions").where({ id }).first();
            return response.status(201).json(session);
        } catch (error) {
            next(error);
        }
    }

    async index(request: Request, response: Response, next: NextFunction) {
        try {
            const querySchema = z.object({
                notebook_id: z.coerce.number().int().positive().optional(),
            });
            const { notebook_id } = querySchema.parse(request.query);

            const query = db("study_sessions").orderBy("created_at", "desc");
            if (notebook_id !== undefined) {
                query.where({ notebook_id });
            }

            return response.json(await query);
        } catch (error) {
            next(error);
        }
    }

    async show(request: Request, response: Response, next: NextFunction) {
        try {
            const { id } = sessionIdSchema.parse(request.params);
            const session = await db("study_sessions").where({ id }).first();

            if (!session) {
                throw new AppError("Sessão de estudo não encontrada!", 404);
            }

            return response.json(session);
        } catch (error) {
            next(error);
        }
    }

    async pause(request: Request, response: Response, next: NextFunction) {
        try {
            const { id } = sessionIdSchema.parse(request.params);
            const session = await db("study_sessions").where({ id }).first();

            if (!session) {
                throw new AppError("Sessão de estudo não encontrada!", 404);
            }
            if (session.status !== "active") {
                throw new AppError("Somente uma sessão ativa pode ser pausada!", 409);
            }

            const elapsedSeconds = Math.max(
                0,
                Math.floor((Date.now() - new Date(session.active_since).getTime()) / 1000),
            );

            await db("study_sessions").where({ id }).update({
                duration_seconds: session.duration_seconds + elapsedSeconds,
                status: "paused",
                active_since: null,
                updated_at: db.fn.now(),
            });

            return response.json({ message: "Cronômetro pausado!" });
        } catch (error) {
            next(error);
        }
    }

    async resume(request: Request, response: Response, next: NextFunction) {
        try {
            const { id } = sessionIdSchema.parse(request.params);
            const session = await db("study_sessions").where({ id }).first();

            if (!session) {
                throw new AppError("Sessão de estudo não encontrada!", 404);
            }
            if (session.status !== "paused") {
                throw new AppError("Somente uma sessão pausada pode ser retomada!", 409);
            }

            await db("study_sessions").where({ id }).update({
                status: "active",
                active_since: db.fn.now(),
                updated_at: db.fn.now(),
            });

            return response.json({ message: "Cronômetro retomado!" });
        } catch (error) {
            next(error);
        }
    }

    async finish(request: Request, response: Response, next: NextFunction) {
        try {
            const { id } = sessionIdSchema.parse(request.params);
            const session = await db("study_sessions").where({ id }).first();

            if (!session) {
                throw new AppError("Sessão de estudo não encontrada!", 404);
            }
            if (session.status === "finished") {
                throw new AppError("Essa sessão já foi finalizada!", 409);
            }

            const elapsedSeconds = session.status === "active"
                ? Math.max(
                    0,
                    Math.floor((Date.now() - new Date(session.active_since).getTime()) / 1000),
                )
                : 0;

            await db("study_sessions").where({ id }).update({
                duration_seconds: session.duration_seconds + elapsedSeconds,
                status: "finished",
                active_since: null,
                finished_at: db.fn.now(),
                updated_at: db.fn.now(),
            });

            const updatedSession = await db("study_sessions").where({ id }).first();
            return response.json(updatedSession);
        } catch (error) {
            next(error);
        }
    }

    async delete(request: Request, response: Response, next: NextFunction) {
        try {
            const { id } = sessionIdSchema.parse(request.params);
            const deletedRows = await db("study_sessions").where({ id }).delete();

            if (!deletedRows) {
                throw new AppError("Sessão de estudo não encontrada!", 404);
            }

            return response.status(200).json({ message: "Sessão de estudo excluída!" });
        } catch (error) {
            next(error);
        }
    }
}
