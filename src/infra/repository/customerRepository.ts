//import {CustomerModel} from "../infra/database/models/mongoose/customer.model"
//import { Document } from "mongoose"
//import CustomerInput from "../infra/database/models/mongoose/customerModel"
 class CustomerRepository {
    customerModel: any
    logger: any 
    constructor({customerModel , logger}: any){
        this.customerModel = customerModel
        this.logger = logger
    }

    async create (payload: any) {
            try {
                const {fullName, phoneNo, address, avatar, email , password} = payload
                const customer = await this.customerModel.create(payload);
                const saveCustomer = await customer.save()
                return saveCustomer
            } catch (error) {
                this.logger.error(error);
            }
    }

    async get (customerId: any) {
            try {
                const customer = await this.customerModel.findById(customerId)
                return customer
            } catch (error) {
                this.logger.error(error);
                
            }
    }


    async getAll (payload: any) {
        try {
            const {page = 1, limit = 20 } = payload;
            const customers = await this.customerModel.find(payload)
            return customers
        } catch (error) {
            this.logger.error(error);
            
        }
    }


    async update (customerId: any, payload: any) {
        try {
            const customer = await this.customerModel.findOneAndUpdate({_id: customerId}, payload, {
                new: true
            } )
            return customer
        } catch (error) {
            this.logger.error(error);
        }
    }


    async delete (customerId: any) {
            try {
                const customer = await this.customerModel.findByIdAndDelete(customerId)
                return customer
            } catch (error) {
                this.logger.error(error);
                
            }
    }
}

export default CustomerRepository