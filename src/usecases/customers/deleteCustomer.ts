import CustomerRepository from "../../infra/repository/customerRepository"
import log from "../../interface/http/utils/logger"


class DeleteCustomer{
    customerRepository: CustomerRepository
    logger: typeof log
    constructor({customerRepository, logger}: {customerRepository: CustomerRepository , logger: typeof log }) {
        this.customerRepository = customerRepository
        this.logger = logger
    }

    async execute(customerId: String) {
        try {
            const customer = await this.customerRepository.delete(customerId)
            return customer
        } catch (error) {
            throw error
        }
    }
}

export default DeleteCustomer