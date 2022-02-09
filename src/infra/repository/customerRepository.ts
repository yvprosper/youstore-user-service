import bcrypt from "bcrypt"
import NotFoundError from "../../interface/http/errors/notFound"
import { CustomerDocument } from "../database/models/mongoose/customerModel"
import CustomerModel from "../database/models/mongoose/customerModel"
import log from "../../interface/http/utils/logger"


 class CustomerRepository {
    customerModel: typeof CustomerModel
    logger: typeof log
    constructor({customerModel , logger}: {customerModel: typeof CustomerModel, logger: typeof log}){
        this.customerModel = customerModel
        this.logger = logger
    }

    async create (payload: CustomerDocument) {
            try {
                let {fullName, phoneNo, address, avatar, email , password} = payload
                const hashedPassword= await bcrypt.hash(password , 12)
                password = hashedPassword
                const customer = await this.customerModel.create({fullName, phoneNo, address, avatar, email , password});
                const saveCustomer = await customer.save()
                return saveCustomer
            } catch (error) {
                this.logger.error(error);
            }
    }

    async get (customerId: String) {
            try {
                const customer = await this.customerModel.findById(customerId)
                return customer
            } catch (error) {
                this.logger.error(error);
                
            }
    }


    async getAll (payload: Object) {
        try {
            const customers = await this.customerModel.find(payload)
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