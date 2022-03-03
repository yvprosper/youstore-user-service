import { Request, Response } from "express";
import AuthenticateCustomer from "../../../usecases/auth/authenticateCustomer";
import { CustomerDocument } from "../../../infra/database/models/mongoose/customerModel";
import ChangeCustomerPassword from "../../../usecases/auth/changeCustomerPassword";
import ResetCustomerPassword from "../../../usecases/auth/resetCustomerPassword";
import VerifyCustomerResetToken from "../../../usecases/auth/verifyCustomerResetToken";
import VerifyCustomerEmailToken from "../../../usecases/auth/verifyCustomerEmailToken";


class CustomerAuth {
    authenticateCustomer: AuthenticateCustomer
    changeCustomerPassword: ChangeCustomerPassword
    resetCustomerPassword: ResetCustomerPassword
    verifyCustomerResetToken: VerifyCustomerResetToken
    verifyCustomerEmailToken: VerifyCustomerEmailToken
    constructor({authenticateCustomer, changeCustomerPassword, resetCustomerPassword, verifyCustomerResetToken, verifyCustomerEmailToken}: 
        {authenticateCustomer: AuthenticateCustomer, changeCustomerPassword: ChangeCustomerPassword, 
        resetCustomerPassword: ResetCustomerPassword, verifyCustomerResetToken: VerifyCustomerResetToken, verifyCustomerEmailToken: VerifyCustomerEmailToken}) {
        this.authenticateCustomer = authenticateCustomer
        this.changeCustomerPassword = changeCustomerPassword
        this.resetCustomerPassword = resetCustomerPassword
        this.verifyCustomerResetToken = verifyCustomerResetToken
        this.verifyCustomerEmailToken = verifyCustomerEmailToken
    }

    async authenticate(req: Request , res: Response) {
        try {
        const payload = req.body
        const {token, customer}: {token: string , customer: CustomerDocument} = await this.authenticateCustomer.execute(payload)

        //const {password, ...response} = customer
        const response = {
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
        .json({success: true, msg: `customer successfully logged in`, data: {token , response} })

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
            const customerId = req.user._id
            await this.changeCustomerPassword.execute(customerId, payload)

            res.status(200)
            .json({success: true, msg: `customer password successfully changed`})
        } catch (error) {
            if (error instanceof Error ) {
                throw new Error(`${error.message}`)
            }
            throw error
        }
    }

    async reset(req: Request , res: Response) {
        try {
            const {email} = req.body
            const link = await this.resetCustomerPassword.execute(email)

            res.status(200)
            .json({success: true, msg: `The reset link has been sent to your email`, data: link})

        } catch (error) {
            if (error instanceof Error ) {
                throw new Error(`${error.message}`)
            }
            throw error
        }
    }

    async verify(req: Request , res: Response) {
        try {
            const body = req.body
            const customerId = req.params.id
            const token = req.params.token

            await this.verifyCustomerResetToken.execute(customerId,token,body)
            res.status(200)
            .json({success: true, msg: `Password Reset Successful`})
        } catch (error) {
            if (error instanceof Error ) {
                throw new Error(`${error.message}`)
            }
            throw error
        }
    }

    async verifyEmail(req: Request , res: Response) {
        try {
            const customerId = req.params.id
            const token = req.params.token

            await this.verifyCustomerEmailToken.execute(customerId,token)
            res.status(200)
            .json({success: true, msg: `Email Verification Successful`})
        } catch (error) {
            if (error instanceof Error ) {
                throw new Error(`${error.message}`)
            }
            throw error
        }
    }

}


export default CustomerAuth