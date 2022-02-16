import { Request, Response } from "express";
import AuthenticateMerchant from "../../../usecases/auth/merchants/authenticateMerchant";
import { MerchantDocument } from "../../../infra/database/models/mongoose/merchantModel";
import ChangeMerchantPassword from "../../../usecases/auth/merchants/changePassword";



class MerchantAuth {
    authenticateMerchant: AuthenticateMerchant
    changeMerchantPassword: ChangeMerchantPassword
    constructor({authenticateMerchant, changeMerchantPassword}: 
        {authenticateMerchant: AuthenticateMerchant, changeMerchantPassword: ChangeMerchantPassword}) {
        this.authenticateMerchant = authenticateMerchant
        this.changeMerchantPassword = changeMerchantPassword
    }

    async authenticate(req: Request , res: Response) {
        try {
        const payload = req.body
        const {token, merchant}: {token: string , merchant: MerchantDocument} = await this.authenticateMerchant.execute(payload)

        //const {password, ...response} = customer
        const response = {
            _id: merchant?._id,
            fullName: merchant?.fullName,
            address: merchant?.address,
            avatar: merchant?.avatar,
            phoneNo: merchant?.phoneNo,
            storeName: merchant?.storeName,
            email: merchant?.email,
            createdAt: merchant?.createdAt,
            updatedAt: merchant?.updatedAt
        }

        res.status(200)
        .header('auth-token', token)
        .json({success: true, msg: `merchant successfully logged in`, data: {token , response} })

        } catch (error) {
            if (error instanceof Error ) {
                throw new Error(`${error.message}`)
            }
            throw error
        }
    }

    async changePassword(req: Request , res: Response) {
        try { 
            const payload = req.body
            const merchantId = req.user._id
            await this.changeMerchantPassword.execute(merchantId, payload)

            res.status(200)
            .json({success: true, msg: `merchant password successfully changed`})
        } catch (error) {
            if (error instanceof Error ) {
                throw new Error(`${error.message}`)
            }
            throw error
        }
    }

}


export default MerchantAuth