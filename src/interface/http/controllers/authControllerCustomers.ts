import { Request, Response } from "express";
import AuthenticateCustomer from "../../../usecases/auth/customers/authenticateCustomer";
import { CustomerDocument } from "../../../infra/database/models/mongoose/customerModel";
import ChangeCustomerPassword from "../../../usecases/auth/customers/changePassword";



class CustomerAuth {
    authenticateCustomer: AuthenticateCustomer
    changeCustomerPassword: ChangeCustomerPassword
    constructor({authenticateCustomer, changeCustomerPassword}: 
        {authenticateCustomer: AuthenticateCustomer, changeCustomerPassword: ChangeCustomerPassword}) {
        this.authenticateCustomer = authenticateCustomer
        this.changeCustomerPassword = changeCustomerPassword
    }

    async authenticate(req: Request , res: Response) {
        try {
        const payload = req.body
        const {token, customer}: {token: string , customer: CustomerDocument} = await this.authenticateCustomer.execute(payload)

        //const {password, ...response} = customer
        const response = {
            _id: customer?._id,
            fullName: customer?.fullName,
            address: customer?.address,
            avatar: customer?.avatar,
            phoneNo: customer?.phoneNo,
            email: customer?.email,
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

}


export default CustomerAuth