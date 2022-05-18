import { Request, Response } from "express";
import AuthenticateCustomer from "../../../usecases/auth/authenticateCustomer";
import AuthenticateMerchant from "../../../usecases/auth/authenticateMerchant";
import AuthenticateAdmin from "../../../usecases/auth/authenticateAdmin";
import ChangeAdminPassword from "../../../usecases/auth/changeAdminPassword";
import ResetAdminPassword from "../../../usecases/auth/resetAdminPassword";
import VerifyAdminResetToken from "../../../usecases/auth/verifyAdminResetToken";
import HTTP_STATUS from "http-status-codes"
import { CustomerDocument } from "../../../infra/database/models/mongoose/customerModel";
import { MerchantDocument } from "../../../infra/database/models/mongoose/merchantModel";
import { AdminDocument } from "../../../infra/database/models/mongoose/adminModel";
import GetCustomer from "../../../usecases/customers/getCustomer";
import GetMerchant from "../../../usecases/merchants/getMerchant";
import GetAdmin from "../../../usecases/admin/getAdmin";

class Auth {
    authenticateCustomer: AuthenticateCustomer
    authenticateMerchant: AuthenticateMerchant
    authenticateAdmin: AuthenticateAdmin
    changeAdminPassword: ChangeAdminPassword
    resetAdminPassword: ResetAdminPassword
    verifyAdminResetToken: VerifyAdminResetToken
    getCustomer: GetCustomer
    getMerchant: GetMerchant
    getAdmin: GetAdmin
    constructor({authenticateCustomer, authenticateMerchant, authenticateAdmin, changeAdminPassword,
        verifyAdminResetToken, resetAdminPassword,getCustomer, getMerchant, getAdmin,}: 
        {authenticateCustomer: AuthenticateCustomer,authenticateMerchant: AuthenticateMerchant,getCustomer: GetCustomer, getMerchant: GetMerchant,
        authenticateAdmin: AuthenticateAdmin,changeAdminPassword: ChangeAdminPassword, resetAdminPassword: ResetAdminPassword,verifyAdminResetToken: VerifyAdminResetToken, getAdmin: GetAdmin }) 
    {
        this.authenticateCustomer = authenticateCustomer
        this.authenticateMerchant = authenticateMerchant
        this.getCustomer = getCustomer
        this.getMerchant = getMerchant
        this.getAdmin = getAdmin
        this.authenticateAdmin = authenticateAdmin
        this.changeAdminPassword = changeAdminPassword
        this.resetAdminPassword = resetAdminPassword
        this.verifyAdminResetToken = verifyAdminResetToken
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
        }else if (userType == 'admin') {
            const {token, admin}: {token: string , admin: AdminDocument} = await this.authenticateAdmin.execute(payload)
            const user = {
                _id: admin?._id,
                firstName: admin?.firstName,
                lastName: admin?.lastName,
                role: admin?.role,
                permissions: admin?.permissions,
                avatar: admin?.avatar,
                phoneNo: admin?.phoneNo,
                email: admin?.email,
                hasCompletedSignUp: admin?.hasCompletedSignUp,
                createdAt: admin?.createdAt,
                updatedAt: admin?.updatedAt
            }
            res.status(200)
            .header('auth-token', token)
            .json({success: true, msg: `admin successfully logged in`, data: {token , user} })
        } else {
            res.status(400)
            .json({success: false, msg: `request query userType must be either "merchant" or "customer" or "admin"` })
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
                    const customerId = req.user._id
                    const user = await this.getCustomer.execute(customerId)
                    res.status(HTTP_STATUS.OK).json({success: true , msg:`Customer details successfully retrieved`, data: user})
                } else if (userType == 'merchant'){
                    const merchantId = req.user._id
                    const user = await this.getMerchant.execute(merchantId)
                    res.status(HTTP_STATUS.OK).json({success: true , msg:`Merchant details successfully retrieved`, data:  user})
                }else if (userType == 'admin'){
                    const adminId = req.user._id
                    const user = await this.getAdmin.execute(adminId)
                    res.status(HTTP_STATUS.OK).json({success: true , msg:`Admin details successfully retrieved`, data:  user})
                } else {
            res.status(400)
            .json({success: false, msg: `request query userType must be either "merchant" or "customer" or "admin"` })
            }

            }catch (error) {
                if (error instanceof Error ) {
                    res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`${error.message}`})
                    throw new Error(`${error.message}`)
                } 
                
                throw error
            }


    }

    //change Admin Password
    async changePassword(req: Request , res: Response) {
        try { 
            const payload = req.body
            const adminId = req.user._id
            await this.changeAdminPassword.execute(adminId, payload)

            res.status(200)
            .json({success: true, msg: `admin password successfully changed`})
        } catch (error) {
            if (error instanceof Error ) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`${error.message}`})
                throw new Error(`${error.message}`)
            } 
            throw error
        }
    }

    //Admin request password reset
    async reset(req: Request , res: Response) {
        try {
            const {email} = req.body
             const link = await this.resetAdminPassword.execute(email)

            res.status(200)
            .json({success: true, msg: `The reset link has been sent to your email`, data: link})

        } catch (error) {
            if (error instanceof Error ) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`${error.message}`})
                throw new Error(`${error.message}`)
            } 
            throw error
        }
    }

    // Verify Admin password reset token
    async verify(req: Request , res: Response) {
        try {
            const body = req.body
            const adminId = req.params.id
            const token = req.params.token

            await this.verifyAdminResetToken.execute(adminId,token,body)
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

    async redirect(req: Request , res: Response){
        res.redirect('https://youstore-staging.netlify.app/auth/reset-password?user=admin')
    }


}


export default Auth