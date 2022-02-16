import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import CustomerRepository from "../../../infra/repository/customerRepository"
import CustomerModel from "../../../infra/database/models/mongoose/customerModel"
import log from "../../../interface/http/utils/logger"
import { signInValidation } from "../../../interface/http/validations/customerValidations"
import { CustomerDocument } from "../../../infra/database/models/mongoose/customerModel"
import { Iauth } from "../../../interface/http/validations/customerValidations"
import Config from "config"


 class AuthenticateCustomer{
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

    async execute({email, password}: Iauth) {

            // Schema validation
            const {error} = signInValidation({email, password})
            if (error)  throw new Error(` ${error.details[0].message}`)

            //checking if customer is registered
            const customer: CustomerDocument | null = await this.customerModel.findOne({email: email})

            if (!customer) throw new Error('Your email or password is incorrect')
                  
             // verifying customer password with the one in our database
            const validPass = await bcrypt.compare(password , customer.password) 
            if (!validPass) throw new Error('Your email or password is incorrect')
     
            //  generating jwt token
            const token = await jwt.sign({_id: customer._id}, this.config.get('customerSecret'));

            return {token, customer}
    }
}

export default AuthenticateCustomer