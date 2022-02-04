 class CreateCustomer{
    customerRepository: any
    logger: any
    constructor({customerRepository, logger}: any) {
        this.customerRepository = customerRepository
        this.logger = logger
    }

    async execute(body: any) {
        try {
          const customer = await this.customerRepository.create(body)
          return customer
        } catch (error) {
            this.logger.error(error)
        }
    }
}

export default CreateCustomer