import { Request, NextFunction } from "express";
import { AdminDocument } from "../../../infra/database/models/mongoose/adminModel";


const checkPermission = (permission: string[])=> {
    return function(req: Request, next: NextFunction) {
        doCheck(req, permission, next);
      };

}

export const doCheck = (req: Request, permission: string[], next: NextFunction) => {
    const user = req.user
    user.map((user: AdminDocument)=> {
        if (user.permissions !== permission) return new Error(`Forbidden: you don't have neccessary permission to access this route`)
        next()
    })
};

export default checkPermission