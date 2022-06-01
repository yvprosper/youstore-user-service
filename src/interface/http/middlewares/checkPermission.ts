import { Request, Response, NextFunction } from "express";



const checkPermission = (permission: String)=> {
    return function(req: Request,res: Response, next: NextFunction) {
        doCheck(req, permission, next);
      };

}

export const doCheck = (req: Request, permission: String, next: NextFunction) => {
    

    if (req.user.permissions.indexOf(permission)=== -1) {
        next(new Error(`Forbidden: you don't have neccessary permission to access this route`))
    }
    next()
};

export default checkPermission