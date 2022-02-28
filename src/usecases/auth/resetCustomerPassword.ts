import CustomerRepository from "../../infra/repository/customerRepository"
import CustomerModel from "../../infra/database/models/mongoose/customerModel"
import log from "../../interface/http/utils/logger"
import { CustomerDocument } from "../../infra/database/models/mongoose/customerModel"
import Config from "config"
import jwt from "jsonwebtoken"
import Messenger from "../../infra/libs/rabbitmq";

 class ResetCustomerPassword{
    customerRepository: CustomerRepository
    logger: typeof log
    customerModel: typeof CustomerModel
    config: typeof Config
    messenger: Messenger
    constructor({customerRepository, logger, customerModel , config, messenger}: 
        {customerRepository: CustomerRepository, customerModel: typeof CustomerModel, logger: typeof log, config: typeof Config, messenger: Messenger}) {
        this.customerRepository = customerRepository
        this.logger = logger
        this.customerModel = customerModel
        this.config = config
        this.messenger = messenger
    }

    async execute(email: String) {

            //checking if customer is registered 
            const customer: CustomerDocument | null = await this.customerModel.findOne({email: email})
            if (!customer) throw new Error('Customer with this EMAIL not found')

            // creating a reset token
            const secret = this.config.get('customerReset') + customer.password
            const payload = {
                email: customer.email,
                id: customer._id
            }
            const token = jwt.sign(payload, secret, {expiresIn: '10m'})
                  
            // creating a reset link
            const link = `http://localhost:5000/v1/auth/reset-password/${customer._id}/${token}`

            this.messenger.sendToQueue(`reset_customer_password`, {customer, link})

            return  link
        }
    }

export default ResetCustomerPassword