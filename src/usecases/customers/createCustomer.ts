import conflictError from "../../interface/http/errors/conflict"
import HTTP_STATUS from "http-status-codes"
import { createCustomerSchema } from "../../interface/http/validations/customerValidations"
import CustomerRepository from "../../infra/repository/customerRepository"
import CustomerModel from "../../infra/database/models/mongoose/customerModel"
import { CustomerDocument } from "../../infra/database/models/mongoose/customerModel"
import log from "../../interface/http/utils/logger"


 class CreateCustomer{
    customerRepository: CustomerRepository
    logger: typeof log
    customerModel: typeof CustomerModel
    constructor({customerRepository, logger, customerModel}: {customerRepository: CustomerRepository, customerModel: typeof CustomerModel, logger: typeof log}) {
        this.customerRepository = customerRepository
        this.logger = logger
        this.customerModel = customerModel
    }

    async execute(payload: CustomerDocument) {
        try {
            //validating user input
            const {error} = createCustomerSchema(payload)
            if (error)  throw new Error(` ${error.details[0].message}`)

           //checking if user already exist
            const {email, phoneNo} = payload

            //check if phoneNo is unique
            const phoneNoExists = await this.customerModel.findOne({phoneNo: phoneNo})
            if (phoneNoExists) throw new conflictError('phone number must be unique please change your phoneNo and try again',HTTP_STATUS.CONFLICT,`error`)

            const alreadyExist = await this.customerModel.findOne({email: email})
            if (alreadyExist) throw new conflictError('A Customer with this Email already exist',HTTP_STATUS.CONFLICT,`error`)

            const customer = await this.customerRepository.create(payload)
            return customer
          
        } catch (error) {
            throw error
        }
    }
}

export default CreateCustomer