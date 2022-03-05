import CustomerRepository from "../../infra/repository/customerRepository"
import { CustomerDocument } from "../../infra/database/models/mongoose/customerModel"
import log from "../../interface/http/utils/logger"


class UpdateCustomer{
    customerRepository: CustomerRepository
    logger: typeof log
    constructor({customerRepository, logger}: {customerRepository: CustomerRepository, logger: typeof log}) {
        this.customerRepository = customerRepository
        this.logger = logger
    }

    async execute(customerId: String, payload: CustomerDocument) {
        try {
            const {password} = payload
            if (password) throw new Error (`you cannot change password with this route`)
            const customer = await this.customerRepository.update(customerId, payload)
            return customer
        } catch (error) {
            throw error
        }
    }
}

export default UpdateCustomer