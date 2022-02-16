import bcrypt from "bcrypt"
import CustomerRepository from "../../../infra/repository/customerRepository"
import CustomerModel from "../../../infra/database/models/mongoose/customerModel"
import log from "../../../interface/http/utils/logger"
import { changePasswordValidation } from "../../../interface/http/validations/customerValidations"
import { CustomerDocument } from "../../../infra/database/models/mongoose/customerModel"
import { IchangePassword } from "../../../interface/http/validations/customerValidations"
import Config from "config"


 class ChangeCustomerPassword{
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

    async execute(customerId: String, payload: IchangePassword) {

            const {oldPassword, newPassword} = payload

            // Schema validation
            const {error} = changePasswordValidation({oldPassword, newPassword})
            if (error)  throw new Error(` ${error.details[0].message}`)

            //checking if customer is registered and if oldPassword is correct
            const customer: CustomerDocument | null = await this.customerModel.findOne({_id: customerId})
            if (!customer) throw new Error('Customer with this ID not found')

            // comparing oldPassword with current password in our database
            const validPassword = await bcrypt.compare(oldPassword , customer.password) 
            if (!validPassword) throw new Error(`your old password is incorrect`)
                  
            // hashing newPassword and changing the password to the new password
            const hashPassword = await bcrypt.hash(newPassword , 12) 
            customer.password = hashPassword
            await customer.save()

            return  customer
        }
    }

export default ChangeCustomerPassword