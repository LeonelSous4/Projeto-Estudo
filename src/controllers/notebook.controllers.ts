import { NextFunction, Request, Response } from "express"
import { db } from "@/database/knex";
import { AppError } from "@/utils/AppError";
import { z } from "zod";


class NotebookController {

    async create(request: Request, response: Response, next: NextFunction){

        try {

         const bodySchema = z.object({
                name: z.string().trim().min(1, "O nome do notebook é obrigatório!"),
                collection_id: z.number().int().positive("O ID da coleção e obrigatorio!"),   
            });
            const { name, collection_id } = bodySchema.parse(request.body);

            const collection = await db("collections")
                .where({ id: collection_id })
                .first();

            if (!collection) {
                throw new AppError("Coleção não encontrada!", 404);
        }


            await db("notebooks").insert({ name, collection_id });
       
            
            return response.status(201).json({message: "ok", name: name})
            
        } catch (error) {
            next(error);        }

    }

    async index(request: Request, response: Response, next: NextFunction){

        try {

        const { collection_id } = request.query;

        const query = db("notebooks");

        if (collection_id) {
            query.where({ collection_id });
        }

        const notebooks = await query;
        return response.json(notebooks);

        }catch (error) {
            next(error);        
        }
    }








        async show(request: Request, response: Response, next: NextFunction){

        try {

            const {id} = request.params

            const notebook = await db('notebooks')
            .where('id', id)
            .first()

            if (!notebook) {
                throw new AppError("Notebook não encontrado.", 404);
            }

           
            
            return response.status(201).json({notebook})
            
        } catch (error) {
            next(error);        }

    }


        async update(request: Request, response: Response, next: NextFunction){

        try {
            const { id } = request.params;
            const { name, description } = request.body;

            if (!name) {
                throw new AppError("O nome do notebook é obrigatório!", 400);
            }

            // 1. Primeiro verifica se o notebook existe
            const notebook = await db('notebooks').where({ id }).first();

            if (!notebook) {
                throw new AppError("Notebook não encontrado.", 404);
            }

            // 2. Faz a atualização
            await db('notebooks')
                .where({ id })
                .update({ 
                    name, 
                    updated_at: db.fn.now() 
                });

            return response.status(200).json({ message: "Notebook atualizado com sucesso!", notebook });

      
    
        
        } catch (error) {
            next(error);        
}
    
    }
    

        async delete(request: Request, response: Response, next: NextFunction) {
        try {
            const { id } = request.params;

            // 1. Busca o notebook na tabela correta ("notebooks")
            const notebook = await db("notebooks")
                .where({ id })
                .first();

            // 2. Valida se ele existe
            if (!notebook) {
                throw new AppError("Notebook não encontrado.", 404);
            }

            // 3. Executa a exclusão corretamente usando o Knex com await
            await db("notebooks")
                .where({ id })
                .delete();

            // 4. Retorna a resposta com status 200 (OK)
            return response.status(200).json({ message: "Notebook deletado com sucesso!" });
            
        } catch (error) {
            next(error);
        }
    }

}

export {NotebookController}