import CustomerRepository from "../../infra/repository/customerRepository"
import CustomerModel from "../../infra/database/models/mongoose/customerModel"
import log from "../../interface/http/utils/logger"
const cloudinary = require('../../infra/libs/cloudinary')
const fs = require('fs')


class UploadAvatar{
    customerRepository: CustomerRepository
    logger: typeof log
    customerModel: typeof CustomerModel
    constructor({customerRepository, logger, customerModel}: {customerRepository: CustomerRepository, customerModel: typeof CustomerModel, logger: typeof log}) {
        this.customerRepository = customerRepository
        this.logger = logger
        this.customerModel = customerModel
    }

    async execute(payload: any, customerId: String) {
        try {
            
            const uploader = async (path: String) => await cloudinary.uploads(path , 'youstore-customer-photos')
            const url = []
            const file = payload

            const {path} = file
            const newPath = await uploader(path)
            

            url.push(newPath.url)
        
            fs.unlinkSync(path)

            const customer = await CustomerModel.findById(customerId)

            customer!.avatar = url.toString()

            await customer?.save()

            return customer
          
        } catch (error) {
            //this.logger.error(error)
            throw error
        }
    }
}

export default UploadAvatar