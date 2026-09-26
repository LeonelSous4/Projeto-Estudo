import { NextFunction, Request, Response } from "express"

class colectionsController {
    async index(request: Request, response: Response, next: NextFunction){

        try {
            
            return response.json({message: "ok"})
            
        } catch (error) {
            next(error);        }

    }
}

export {colectionsController}