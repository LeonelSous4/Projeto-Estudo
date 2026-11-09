import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { db } from "@/database/knex";
import { AppError } from "@/utils/AppError";
import { date } from "zod/mini";

export class StudySessionController {
    // 1. INICIAR CRONÔMETRO
    async create(request: Request, response: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                notebook_id: z.number().int().positive(),
                type: z.enum(["teoria", "questoes", "revisao"])
            })

            const { notebook_id, type } = bodySchema.parse(request.body);

            const notebook = await db("notebooks").where({id: notebook_id}).first();

            if(!notebook){
            throw new AppError("Caderno não encontrado!", 404)
            }

            const [id] = await db("study_sessions").insert({
                notebook_id,
                type,
                duration_seconds: 0,
                status: "active",
                active_since: db.fn.now(), // Marca a hora que o cronômetro começou a rodar
            });

            return response.status(201).json({ message: "Cronômetro iniciado!", id });

        } catch (error) {
            next(error);
        }
    }



    // 2. LISTAR SESSÕES / HISTÓRICO
    async index(request: Request, response: Response, next: NextFunction) {
        try {

            const { notebook_id } = request.query;

            const query = db("study_sessions").join("notebooks", "study_sessions.notebook_id", "notebooks.id").select(
                "study_sessions.*",
                "notebooks.name as notebook_name"
            );

            if (notebook_id) {
                query.where({ notebook_id: Number(notebook_id) }).orderBy("created_at", "desc");
            }

            const sessions = await query;

            return response.json(sessions);
        } catch (error) {
            next(error);
        }
    }

    // 3. MOSTRAR UMA SESSÃO
    async show(request: Request, response: Response, next: NextFunction) {
        try {
            

            const id = Number(request.params.id);
             const session = await db("study_sessions").join("notebooks", "study_sessions.notebook_id", "notebooks.id").select(
                "study_sessions.*",
                "notebooks.name as notebook_name")
                .where("study_sessions.id", id);

            if (!session) {
                throw new AppError("Sessão não encontrada.", 404);
            }


            return response.json(session);



        } catch (error) {
            next(error);
        }
    }

    // 4. PAUSAR CRONÔMETRO
    async pause(request: Request, response: Response, next: NextFunction) {
        try {
            // Vamos fazer juntos aqui
            const id = Number(request.params.id);

            
            const session = await db("study_sessions").where({id}).first();

             if(!session){
                throw new AppError("sessão nao existe!", 404)
            }

            if(session.status !== "active"){
                throw new AppError("sessão nao esta ativa para ser pausada!", 400)
            }

            if(!session.active_since){
                throw new AppError("sessão nao tem tempo de inicio!", 400)
            }

            const elapsedSeconds = Math.floor(
            (Date.now() - new Date(session.active_since!).getTime()) / 1000
            );

            await db("study_sessions").where({id}).update({
                duration_seconds: session.duration_seconds + elapsedSeconds,
                status: "paused",
                active_since: null,
                updated_at: db.fn.now()

            })

            return response.json({ message: "Cronômetro pausado!", time: session.duration_seconds + elapsedSeconds });


        } catch (error) {
            next(error);
        }
    }

    // 5. RETOMAR CRONÔMETRO
    async resume(request: Request, response: Response, next: NextFunction) {
        try {



            const id = Number(request.params.id);
            
            const session = await db("study_sessions").where({id}).first();

            if(!session){
                throw new AppError("sessão nao existe!", 404)
            }

            if(session.status !== "paused"){
                throw new AppError("sessão nao esta pausada para ser retomada!", 400)
            }

    

               await db("study_sessions").where({id}).update({
               status: "active",
               updated_at: db.fn.now(),
                active_since: db.fn.now(),



            })


            return response.json({ message: "Cronômetro retomado!" });



         
            // Vamos fazer juntos aqui
        }catch (error) {
            next(error);
        }
    

    }

    // 6. FINALIZAR CRONÔMETRO
    async finish(request: Request, response: Response, next: NextFunction) {
        try {
            const id = Number(request.params.id);
            
            const session = await db("study_sessions").where({ id }).first();

            if (!session) {
                throw new AppError("Sessão não existe!", 404);
            }

            if (session.status === "finished") {
                throw new AppError("Essa sessão já foi finalizada!", 400);
            }

            
            let elapsedSeconds = 0;
            if (session.status === "active" && session.active_since) {
                elapsedSeconds = Math.floor(
                    (Date.now() - new Date(session.active_since).getTime()) / 1000
                );
            }

            const totalDuration = session.duration_seconds + elapsedSeconds;

            await db("study_sessions").where({ id }).update({
                duration_seconds: totalDuration,
                status: "finished",
                active_since: null,
                finished_at: db.fn.now(),
                updated_at: db.fn.now(),
            });

            return response.json({ 
                message: "Cronômetro finalizado!", 
                duration_seconds: totalDuration 
            });
        } catch (error) {
            next(error);
        }
    }

    // 7. EXCLUIR UMA SESSÃO
    async delete(request: Request, response: Response, next: NextFunction) {
        try {

            const id = Number(request.params.id);

            const session = await db("study_sessions")
            .where({ id })
            .first();

            if (!session) {
            throw new AppError("Sessão não encontrada!", 404);
            }

            await db("study_sessions").where({ id }).del();




            return response.status(200).json({ message: "sessão deletada com sucesso" });


        } catch (error) {
            next(error);
        }
    }



          // 8. RESUMO DO DIA
    async today(request: Request, response: Response, next: NextFunction) {
        try {
            // Pega todas as sessões criadas hoje
            const sessions = await db("study_sessions")
                .whereRaw("DATE(created_at) = CURDATE()");

            const summary = {
                teoria: 0,
                questoes: 0,
                revisao: 0,
                total: 0
            };

            for (const session of sessions) {
                const duration = session.duration_seconds;

                if (session.type === "teoria") {
                    summary.teoria += duration;
                } else if (session.type === "questoes") {
                    summary.questoes += duration;
                } else if (session.type === "revisao") {
                    summary.revisao += duration;
                }

                summary.total += duration;
            }

            return response.json(summary);
        } catch (error) {
            next(error);
        }
    }



}
