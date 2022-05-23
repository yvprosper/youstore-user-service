import bcrypt from "bcrypt"
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
                let {firstName, lastName, phoneNo, address, avatar, email , password} = payload
                const hashedPassword= await bcrypt.hash(password , 12)
                password = hashedPassword
                const customer = await this.customerModel.create({firstName, lastName, phoneNo, address, avatar, email , password});
                const saveCustomer = await customer.save()

                // creating an email verification token
                const secret = this.config.get('customerEmailSecret') 
                const token = jwt.sign({email: saveCustomer.email}, `${secret}`, {expiresIn: '1d'})
                  
                // creating an email verification link
                const link = `https://youstore-users.herokuapp.com/v1/auth/customer/confirmation/${saveCustomer._id}/${token}`
                

                //send to Queue
                this.messenger.sendToQueue(`verify_customer_email`, {link, saveCustomer})

                return saveCustomer
                
            } catch (error) {
               throw error 
            }
    }

    async get (customerId: String) {
            try {
                const customer = await this.customerModel.findById(customerId, {password: 0})
                if(!customer) throw new Error('Customer with this ID does not exist')
                return customer
            } catch (error) {
                throw error
                
            }
    }


    async getAll (payload: any) {
        try {
            const {page = 1 , limit = 10 } = payload; 
            const customers = await this.customerModel.find({}, {password: 0}).limit(limit * 1).skip((page - 1) * limit)
            return customers
        } catch (error) {
           throw error
            
        }
    }


    async update (customerId: String, payload: CustomerDocument) {
        try {
            const customer = await this.customerModel.findOneAndUpdate({_id: customerId}, payload, {
                new: true
            } )

            if(!customer) throw new Error('Customer with this ID does not exist')

            return customer
        } catch (error) {
            throw error
        }
    }


    async delete (customerId: String) {
            try {
                const customer = await this.customerModel.findOneAndDelete({_id: customerId})
                if(!customer) throw new Error('Customer with this ID does not exist')
                

                //send to Queue
                this.messenger.sendToQueue(`customer_deleted`, customerId)
                return customer
            } catch (error) {
                throw error
                
            }
    }

}

export default CustomerRepository