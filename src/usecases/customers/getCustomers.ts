class GetCustomers{
    customerRepository: any
    logger: any
    constructor({customerRepository, logger}: any) {
        this.customerRepository = customerRepository
        this.logger = logger
    }

    async execute(payload: any) {
        try {
           const customers =  await this.customerRepository.getAll(payload)
           return customers
        } catch (error) {
            this.logger.error(error)
        }
    }
}

export default GetCustomers