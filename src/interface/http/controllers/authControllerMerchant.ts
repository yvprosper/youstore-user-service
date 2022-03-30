import { Request, Response } from "express";
import AuthenticateMerchant from "../../../usecases/auth/authenticateMerchant";
import { MerchantDocument } from "../../../infra/database/models/mongoose/merchantModel";
import ChangeMerchantPassword from "../../../usecases/auth/changeMerchantPassword";
import ResetMerchantPassword from "../../../usecases/auth/resetMerchantPassword";
import VerifyMerchantResetToken from "../../../usecases/auth/verifyMerchantResetToken";
import VerifyMerchantEmailToken from "../../../usecases/auth/verifyMerchantEmailToken";
import HTTP_STATUS from "http-status-codes"



class MerchantAuth {
    authenticateMerchant: AuthenticateMerchant
    changeMerchantPassword: ChangeMerchantPassword
    resetMerchantPassword: ResetMerchantPassword
    verifyMerchantResetToken: VerifyMerchantResetToken
    verifyMerchantEmailToken: VerifyMerchantEmailToken
    constructor({authenticateMerchant, changeMerchantPassword, resetMerchantPassword , verifyMerchantResetToken , verifyMerchantEmailToken}: 
        {authenticateMerchant: AuthenticateMerchant, changeMerchantPassword: ChangeMerchantPassword, resetMerchantPassword: ResetMerchantPassword,
         verifyMerchantResetToken: VerifyMerchantResetToken, verifyMerchantEmailToken: VerifyMerchantEmailToken}) {
        this.authenticateMerchant = authenticateMerchant
        this.changeMerchantPassword = changeMerchantPassword
        this.resetMerchantPassword =resetMerchantPassword
        this.verifyMerchantResetToken = verifyMerchantResetToken
        this.verifyMerchantEmailToken = verifyMerchantEmailToken
    }

    async authenticate(req: Request , res: Response) {
        try {
        const payload = req.body
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

        } catch (error) {
            if (error instanceof Error ) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`${error.message}`})
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
                res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`${error.message}`})
                throw new Error(`${error.message}`)
            } 
            throw error
        }
    }

    async reset(req: Request , res: Response) {
        try {
            const {email} = req.body
            await this.resetMerchantPassword.execute(email)

            res.status(200)
            .json({success: true, msg: `The reset link has been sent to your email`})

        } catch (error) {
            if (error instanceof Error ) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`${error.message}`})
                throw new Error(`${error.message}`)
            } 
            throw error
        }
    }

    async verify(req: Request , res: Response) {
        try {
            const body = req.body
            const merchantId = req.params.id
            const token = req.params.token

            await this.verifyMerchantResetToken.execute(merchantId,token,body)
            res.status(200)
            .json({success: true, msg: `Password Reset Successful`})
        } catch (error) {
            if (error instanceof Error ) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`${error.message}`})
                throw new Error(`${error.message}`)
            } 
            throw error
        }
    }

    async verifyEmail(req: Request , res: Response) {
        try {
            const merchantId = req.params.id
            const token = req.params.token

            await this.verifyMerchantEmailToken.execute(merchantId,token)
            res.redirect('https://youstore-staging.netlify.app/auth/verify-email/')
            res.status(200)
            .json({success: true, msg: `Email Verification Successful`})
        } catch (error) {
            if (error instanceof Error ) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`${error.message}`})
                throw new Error(`${error.message}`)
            } 
            throw error
        }
    }

    async redirect(req: Request , res: Response){
        res.redirect('https://youstore-staging.netlify.app/auth/verify-email/')
    }


}


export default MerchantAuth