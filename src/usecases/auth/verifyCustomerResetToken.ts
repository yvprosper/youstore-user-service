import CustomerRepository from "../../infra/repository/customerRepository"
import CustomerModel from "../../infra/database/models/mongoose/customerModel"
import log from "../../interface/http/utils/logger"
import { CustomerDocument } from "../../infra/database/models/mongoose/customerModel"
import Config from "config"
import jwt from "jsonwebtoken"
import Messenger from "../../infra/libs/rabbitmq";
import bcrypt from "bcrypt"
import { resetPasswordValidation, IresetPassword } from "../../interface/http/validations/customerValidations"

 class VerifyCustomerResetToken{
    customerRepository: CustomerRepository
    logger: typeof log
    customerModel: typeof CustomerModel
    config: typeof Config
    messenger: Messenger
    constructor({customerRepository, logger, customerModel , config, messenger}: 
        {customerRepository: CustomerRepository, customerModel: typeof CustomerModel, logger: typeof log, config: typeof Config, messenger: Messenger}) {
        this.customerRepository = customerRepository
        this.logger = logger
        this.customerModel = customerModel
        this.config = config
        this.messenger = messenger
    }

    async execute(customerId: string, token: string, body: IresetPassword) {
        try {
        const {newPassword, confirmPassword} = body
            // Schema validation
            const {error} = resetPasswordValidation({confirmPassword, newPassword})
            if (error)  throw new Error(` ${error.details[0].message}`) 

            //checking if customer is registered 
            const customer: CustomerDocument | null = await this.customerModel.findOne({_id: customerId})
            if (!customer) throw new Error('Customer with this ID not found')

            // verifying the reset token
            const secret = this.config.get('customerReset') + customer.password
            const payload =  jwt.verify(token, secret)
            if (!payload) throw new Error('Invalid Token')


            // check if newPassword and confirmPassword are thesame
            if(newPassword !== confirmPassword) throw new Error('password mismatch!')
            

            // hashing newPassword and changing the password to the new password
            const hashPassword = await bcrypt.hash(newPassword , 12) 
            customer.password = hashPassword
            await customer.save()


            return  customer

        } catch (error) {
            throw error
        }
            
        }
    }

export default VerifyCustomerResetToken