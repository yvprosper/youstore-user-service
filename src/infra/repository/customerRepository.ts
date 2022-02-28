import bcrypt from "bcrypt"
import NotFoundError from "../../interface/http/errors/notFound"
import { CustomerDocument } from "../database/models/mongoose/customerModel"
import CustomerModel from "../database/models/mongoose/customerModel"
import log from "../../interface/http/utils/logger"
import Messenger from "../libs/rabbitmq"
import jwt from "jsonwebtoken"
import Config from "config"


  class CustomerRepository {
    customerModel: typeof CustomerModel
    logger: typeof log
    messenger: Messenger
    config: typeof Config
    constructor({customerModel , logger , messenger, config}: {customerModel: typeof CustomerModel, logger: typeof log, messenger: Messenger, config: typeof Config}){
        this.customerModel = customerModel
        this.logger = logger
        this.messenger = messenger
        this.config = config
    }

    async create (payload: CustomerDocument) {
            try {
                let {fullName, phoneNo, address, avatar, email , password} = payload
                const hashedPassword= await bcrypt.hash(password , 12)
                password = hashedPassword
                const customer = await this.customerModel.create({fullName, phoneNo, address, avatar, email , password});
                const saveCustomer = await customer.save()

                // creating an email verification token
                const secret = this.config.get('customerEmailSecret') 
                const token = jwt.sign({email: saveCustomer.email}, `${secret}`, {expiresIn: '1d'})
                  
                // creating an email verification link
                const link = `http://localhost:5000/v1/auth/confirmation/${saveCustomer._id}/${token}`
                

                console.log(link)

                //send to Queue
                this.messenger.sendToQueue(`verify_customer_email`, {link, saveCustomer})

                return saveCustomer
                
            } catch (error) {
                this.logger.error(error);
            }
    }

    async get (customerId: String) {
            try {
                const customer = await this.customerModel.findById(customerId, {password: 0})
                return customer
            } catch (error) {
                this.logger.error(error);
                
            }
    }


    async getAll (payload: Object) {
        try {
            const customers = await this.customerModel.find(payload, {password: 0})
            return customers
        } catch (error) {
            this.logger.error(error);
            
        }
    }


    async update (customerId: String, payload: CustomerDocument) {
        try {
            const customer = await this.customerModel.findOneAndUpdate({_id: customerId}, payload, {
                new: true
            } )
            return customer
        } catch (error) {
            this.logger.error(error);
        }
    }


    async delete (customerId: String) {
            try {
                const customer = await this.customerModel.findOneAndDelete({_id: customerId})
                if(!customer) {
                    throw new NotFoundError('Customer with this ID does not exist' , 404, `error`)
                }
                return customer
            } catch (error) {
                this.logger.error(error);
                
            }
    }

}

export default CustomerRepository