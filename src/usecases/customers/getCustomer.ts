class GetCustomer{
    customerRepository: any
    logger: any
    constructor({customerRepository, logger}: any) {
        this.customerRepository = customerRepository
        this.logger = logger
    }

    async execute(customerId: any) {
        try {
            const customer = await this.customerRepository.get(customerId)
            return customer
        } catch (error) {
            this.logger.error(error)
        }
    }
}

export default GetCustomer