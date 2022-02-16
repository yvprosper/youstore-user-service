import MerchantRepository from "../../infra/repository/merchantRepository"
import MerchantModel from "../../infra/database/models/mongoose/merchantModel"
import log from "../../interface/http/utils/logger"
const cloudinary = require('../../infra/libs/cloudinary')
const fs = require('fs')


class UploadPhoto{
    merchantRepository: MerchantRepository
    logger: typeof log
    merchantModel: typeof MerchantModel
    constructor({merchantRepository, logger, merchantModel}: {merchantRepository: MerchantRepository, merchantModel: typeof MerchantModel, logger: typeof log}) {
        this.merchantRepository = merchantRepository
        this.logger = logger
        this.merchantModel = merchantModel
    }

    async execute(payload: any, merchantId: String) {
        try {
            
            const uploader = async (path: String) => await cloudinary.uploads(path , 'youstore-merchant-photos')
            const url = []
            const file = payload

            console.log(file)

            const {path} = file
            const newPath = await uploader(path)

            console.log(newPath)

            url.push(newPath.url)
        
            fs.unlinkSync(path)

            const customer = await MerchantModel.findById(merchantId)

            customer!.avatar = url.toString()

            await customer?.save()

            return customer
          
        } catch (error) {
            //this.logger.error(error)
            throw error
        }
    }
}

export default UploadPhoto