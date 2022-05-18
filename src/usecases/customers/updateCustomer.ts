import CustomerRepository from "../../infra/repository/customerRepository"
import { CustomerDocument } from "../../infra/database/models/mongoose/customerModel"
import log from "../../interface/http/utils/logger"
import { updateCustomerSchema } from "../../interface/http/validations/customerValidations"


class UpdateCustomer{
    customerRepository: CustomerRepository
    logger: typeof log
    constructor({customerRepository, logger}: {customerRepository: CustomerRepository, logger: typeof log}) {
        this.customerRepository = customerRepository
        this.logger = logger
    }

    async execute(customerId: String, payload: CustomerDocument) {
        try {
            const {password, email} = payload
            if (password || email) throw new Error (`you cannot change password or email with this route`)

            //validating user input
            const {error} = updateCustomerSchema(payload)
            if (error)  throw new Error(` ${error.details[0].message}`)

            const customer = await this.customerRepository.update(customerId, payload)
            return customer
        } catch (error) {
            throw error
        }
    }
}

export default UpdateCustomer