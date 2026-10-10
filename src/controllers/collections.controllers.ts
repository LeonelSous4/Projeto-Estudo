import { NextFunction, Request, Response } from "express"
import { db } from "@/database/knex";
import { AppError } from "@/utils/AppError";
import { Knex } from "knex";

class CollectionsController {

    async create(request: Request, response: Response, next: NextFunction){

        try {

            const {name, description} = request.body

        if (!name) {
                throw new AppError("O nome da coleção é obrigatório!", 400);
            }

            await db("collections").insert({ name });
       
            
            return response.status(201).json({message: "ok", name: name})
            
        } catch (error) {
            next(error);        }

    }


    async index(request: Request, response: Response, next: NextFunction){

        try {

            const collections = await db("collections").select("*");
            
            return response.status(201).json({collections})
            
        } catch (error) {
            next(error);        }

    }
    
    async show(request: Request, response: Response, next: NextFunction){

        try {

            const {id} = request.params

            const collection = await db('collections')
            .where('id', id)
            .first()

            if (!collection) {
                throw new AppError("Coleção não encontrada.", 404);
            }

           
            
            return response.status(201).json({collection})
            
        } catch (error) {
            next(error);        }

    }

    async update(request: Request, response: Response, next: NextFunction){

        try {

            const {id} = request.params
            const {name} = request.body

            const collection = await db('collections')
            .where('id', id)
            .update({ name, updated_at: db.fn.now() })

            return response.status(201).json({message: "Coleção atualizada com sucesso!"})

            if (!name) {
                throw new AppError("nome nao enviado", 400)
            }

            if (!collection) {
                throw new AppError("coleção nao encontrada", 400)
            }
           
            
            return response.status(201).json({collection})
        
            
        } catch (error) {
            next(error);        }

    }














}

export {CollectionsController}