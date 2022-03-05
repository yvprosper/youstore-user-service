import CustomerRepository from "../../infra/repository/customerRepository"
import log from "../../interface/http/utils/logger"


class GetCustomers{
    customerRepository: CustomerRepository
    logger: typeof log
    constructor({customerRepository, logger}: {customerRepository: CustomerRepository, logger: typeof log}) {
        this.customerRepository = customerRepository
        this.logger = logger
    }

    async execute(payload: Object) {
        try {
           const customers =  await this.customerRepository.getAll(payload)
           return customers
        } catch (error) {
            throw error
        }
    }
}

export default GetCustomers