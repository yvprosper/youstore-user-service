import { Request, Response, NextFunction } from "express";
import { AdminDocument } from "../../../infra/database/models/mongoose/adminModel";


const checkPermission = (permission: String)=> {
    return function(req: Request,res: Response, next: NextFunction) {
        doCheck(req, permission, next);
      };

}

export const doCheck = (req: Request, permission: String, next: NextFunction) => {
    // const user = req.user.permissions
    // console.log(permission)
    // //console.log(user)
    // user.map((user: any)=> {
    //     console.log(user)
    //     if (user !== permission) throw new Error(`Forbidden: you don't have neccessary permission to access this route`)
    //     next()
    // })

    if (req.user.permissions.indexOf(permission)=== -1) {
        next(new Error(`Forbidden: you don't have neccessary permission to access this route`))
    }
    next()
};

export default checkPermission