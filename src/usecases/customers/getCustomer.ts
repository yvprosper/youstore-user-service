import CustomerRepository from "../../infra/repository/customerRepository"
import log from "../../interface/http/utils/logger"


class GetCustomer{
    customerRepository: CustomerRepository
    logger: typeof log
    constructor({customerRepository, logger}: {customerRepository: CustomerRepository, logger: typeof log}) {
        this.customerRepository = customerRepository
        this.logger = logger
    }

    async execute(customerId: String) {
        try {
            const customer = await this.customerRepository.get(customerId)
            return customer
        } catch (error) {
            this.logger.error(error)
        }
    }
}

export default GetCustomer