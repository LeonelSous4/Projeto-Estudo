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
            const { id } = request.params;
            const { name, description } = request.body;

            if (!name) {
                throw new AppError("O nome da coleção é obrigatório!", 400);
            }

            // 1. Primeiro verifica se a coleção existe
            const collection = await db('collections').where({ id }).first();

            if (!collection) {
                throw new AppError("Coleção não encontrada.", 404);
            }

            // 2. Faz a atualização
            await db('collections')
                .where({ id })
                .update({ 
                    name, 
                    updated_at: db.fn.now() 
                });

            return response.status(200).json({ message: "Coleção atualizada com sucesso!", collection });

      
    
        
        } catch (error) {
            next(error);        
}
    
}
    






async delete(request: Request, response: Response, next: NextFunction) {
        try {
            const { id } = request.params;

            // 1. Busca a coleção na tabela correta ("collections")
            const collection = await db("collections")
                .where({ id })
                .first();

            // 2. Valida se ela existe
            if (!collection) {
                throw new AppError("Coleção não encontrada.", 404);
            }

            // 3. Executa a exclusão corretamente usando o Knex com await
            await db("collections")
                .where({ id })
                .delete();

            // 4. Retorna a resposta com status 200 (OK)
            return response.status(200).json({ message: "Coleção deletada com sucesso!" });
            
        } catch (error) {
            next(error);
        }
    }
    













}

export {CollectionsController}