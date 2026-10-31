import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { db } from "@/database/knex";
import { AppError } from "@/utils/AppError";

export class StudySessionController {
    // 1. INICIAR CRONÔMETRO
    async create(request: Request, response: Response, next: NextFunction) {
        try {
            // Vamos fazer juntos aqui
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

            const { sessions_id } = request.query;

            const query = db("study_sessions");

            if (sessions_id) {
                query.where({ id: Number(sessions_id) });
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
             const session = await db("study_sessions").where({ id }).first();

            if (!session) {
                throw new AppError("Sessão não encontrada.", 404);
            }


            return response.json(session);









            // Vamos fazer juntos aqui
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

            const elapsedSeconds = Math.floor(
            (Date.now() - new Date(session.active_since!).getTime()) / 1000
            );

            await db("study_sessions").where({id}).update({
                duration_seconds: session.duration_seconds + elapsedSeconds,
                status: "paused",
                active_since: null,
                updated_at: db.fn.now()

            })

            return response.json({ message: "Cronômetro pausado!" })


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
            
            const session = await db("study_sessions").where({id}).first();

            if(!session){
                throw new AppError("sessão nao existe!", 404)
            }

            if(session.status !== "active" && session.status !== "paused"){
                throw new AppError("sessão nao esta ativa ou pausada para ser finalizada!", 400)
            }

              const elapsedSeconds = Math.floor(
            (Date.now() - new Date(session.active_since!).getTime()) / 1000
            );

               await db("study_sessions").where({id}).update({
                duration_seconds: session.duration_seconds + elapsedSeconds,
               status: "finished",
               updated_at: db.fn.now(),
                active_since: db.fn.now(),
            })


            return response.json({ message: "Cronômetro finalizado!", duration_seconds: session.duration_seconds + elapsedSeconds });



         
            // Vamos fazer juntos aqui
        }catch (error) {
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










            // Vamos fazer juntos aqui
        } catch (error) {
            next(error);
        }
    }
}
