import { Request, Response } from "express";
import AuthenticateCustomer from "../../../usecases/auth/authenticateCustomer";
import AuthenticateMerchant from "../../../usecases/auth/authenticateMerchant";
import HTTP_STATUS from "http-status-codes"
import { CustomerDocument } from "../../../infra/database/models/mongoose/customerModel";
import { MerchantDocument } from "../../../infra/database/models/mongoose/merchantModel";
import GetCustomer from "../../../usecases/customers/getCustomer";
import GetMerchant from "../../../usecases/merchants/getMerchant";

class Auth {
    authenticateCustomer: AuthenticateCustomer
    authenticateMerchant: AuthenticateMerchant
    getCustomer: GetCustomer
    getMerchant: GetMerchant
    constructor({authenticateCustomer, authenticateMerchant, getCustomer, getMerchant}: 
        {authenticateCustomer: AuthenticateCustomer,authenticateMerchant: AuthenticateMerchant,getCustomer: GetCustomer, getMerchant: GetMerchant}) {
        this.authenticateCustomer = authenticateCustomer
        this.authenticateMerchant = authenticateMerchant
        this.getCustomer = getCustomer
        this.getMerchant = getMerchant
    }

    async authenticate(req: Request , res: Response) {
        try {
        const payload = req.body
        const {userType} = req.query

        if (userType == 'merchant') {
            const {token, merchant}: {token: string , merchant: MerchantDocument} = await this.authenticateMerchant.execute(payload)
            const user = {
                _id: merchant._id,
                storeName: merchant.storeName,
                address: merchant.address,
                avatar: merchant.avatar,
                storeBanner: merchant.storeBanner,
                phoneNo: merchant.phoneNo,
                email: merchant.email,
                bankName: merchant.bankName,
                accountName: merchant.accountName,
                accountNo: merchant.accountNo,
                isVerified: merchant.isVerified,
                createdAt: merchant.createdAt,
                updatedAt: merchant.updatedAt
            }
    
            res.status(200)
            .header('auth-token', token)
            .json({success: true, msg: `merchant successfully logged in`, data: {token , user} })
        } else if (userType == 'customer') {
            const {token, customer}: {token: string , customer: CustomerDocument} = await this.authenticateCustomer.execute(payload)
            const user = {
                _id: customer?._id,
                firstName: customer?.firstName,
                lastName: customer?.lastName,
                address: customer?.address,
                avatar: customer?.avatar,
                phoneNo: customer?.phoneNo,
                email: customer?.email,
                isVerified: customer?.isVerified,
                createdAt: customer?.createdAt,
                updatedAt: customer?.updatedAt
            }
            res.status(200)
            .header('auth-token', token)
            .json({success: true, msg: `customer successfully logged in`, data: {token , user} })
        } else {
            res.status(200)
            .json({success: false, msg: `request query userType must be either "merchant" or "customer"` })
        }

        } catch (error) {
            if (error instanceof Error ) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`${error.message}`})
                throw new Error(`${error.message}`)
            } 
            throw error
        }
    }

    async fetch (req: Request , res: Response) {
            try {
                const {userType} = req.query

                if (userType == 'customer') {
                    const {userId} = req.params
                    const user = await this.getCustomer.execute(userId)
                    res.status(HTTP_STATUS.OK).json({success: true , msg:`Customer details successfully retrieved`, data: user})
                } else if (userType == 'merchant'){
                    const {userId} = req.params
                    const user = await this.getMerchant.execute(userId)
                    res.status(HTTP_STATUS.OK).json({success: true , msg:`Merchant details successfully retrieved`, data:  user})
                }else {
            res.status(200)
            .json({success: false, msg: `request query userType must be either "merchant" or "customer"` })
                }

            }catch (error) {
                if (error instanceof Error ) {
                    res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`${error.message}`})
                    throw new Error(`${error.message}`)
                } 
                
                throw error
            }


    }

}


export default Auth