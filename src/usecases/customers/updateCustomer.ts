class UpdateCustomer{
    customerRepository: any
    logger: any
    constructor({customerRepository, logger}: any) {
        this.customerRepository = customerRepository
        this.logger = logger
    }

    async execute(customerId: any, payload: any) {
        try {
            const customer = await this.customerRepository.update(customerId, payload)
            return customer
        } catch (error) {
            this.logger.error(error)
        }
    }
}

export default UpdateCustomer