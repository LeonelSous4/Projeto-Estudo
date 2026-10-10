import { NextFunction, Request, Response } from "express"
import { db } from "@/database/knex";
import { AppError } from "@/utils/AppError";

class CollectionsController {
    async index(request: Request, response: Response, next: NextFunction){

        try {

            const {name, description} = request.body

        if (!name) {
                throw new AppError("O nome da coleção é obrigatório!", 400);
            }

       
            
            return response.status(201).json({message: "ok", name: name})
            
        } catch (error) {
            next(error);        }

    }
}

export {CollectionsController}