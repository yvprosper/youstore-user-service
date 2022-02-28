import CustomerRepository from "../../infra/repository/customerRepository"
import CustomerModel from "../../infra/database/models/mongoose/customerModel"
import log from "../../interface/http/utils/logger"
import { CustomerDocument } from "../../infra/database/models/mongoose/customerModel"
import Config from "config"
import jwt from "jsonwebtoken"


 class VerifyCustomerEmailToken{
    customerRepository: CustomerRepository
    logger: typeof log
    customerModel: typeof CustomerModel
    config: typeof Config
    constructor({customerRepository, logger, customerModel , config}: 
        {customerRepository: CustomerRepository, customerModel: typeof CustomerModel, logger: typeof log, config: typeof Config}) {
        this.customerRepository = customerRepository
        this.logger = logger
        this.customerModel = customerModel
        this.config = config
    }

    async execute(customerId: string, token: string) {
            //checking if customer is registered 
            const customer: CustomerDocument | null = await this.customerModel.findOne({_id: customerId})
            if (!customer) throw new Error('Customer with this ID not found')

            // verifying the reset token
            const secret = this.config.get('customerEmailSecret') 
            const payload =  jwt.verify(token, `${secret}`)
            if (!payload) throw new Error('Invalid Token')
            
            // change verification status
            customer.isVerified = true
            await customer.save()

            return  customer
        }
    }

export default VerifyCustomerEmailToken