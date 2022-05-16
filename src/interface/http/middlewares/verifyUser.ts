import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import HTTP_STATUS from 'http-status-codes'
import dotenv from "dotenv"
dotenv.config()

export const verifyUser = (req: Request , res: Response , next: NextFunction) => {
    const authHeader = req.headers.authorization
    const {userType} = req.query
    if (!authHeader || !authHeader.startsWith('Bearer ')){
        res.status(HTTP_STATUS.UNAUTHORIZED).json({success: false , msg:`Access Denied`})
        throw new Error(`Access Denied!`)
    } 
    
    const token = authHeader.split(' ')[1]

    try {

    if (userType == 'customer') {
        const secret = process.env.CUSTOMER_JWT_SECRET
        // verify token and save customer Id to the verified variable
        const verified = jwt.verify(token, `${secret}` )
        req.user = verified;
    } else if (userType == 'merchant') {
        const secret = process.env.MERCHANT_JWT_SECRET
        // verify token and save merchant Id to the verified variable
        const verified = jwt.verify(token, `${secret}` )
        req.user = verified;
    } else if (userType == 'admin') {
        const secret = process.env.ADMIN_JWT_SECRET
        // verify token and save admin Id to the verified variable
        const verified = jwt.verify(token, `${secret}` )
        req.user = verified;
    }else {
         res.status(400)
            .json({success: false, msg: `request query userType must be either "merchant" or "customer" or "admin"` })
        }

    next()
    } catch (error) {
        if (error instanceof Error ) {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({success: false , msg:`${error.message}`})
            throw new Error(`${error.message}`)
        }
        throw error
    }

}