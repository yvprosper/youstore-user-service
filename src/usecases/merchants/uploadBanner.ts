import MerchantRepository from "../../infra/repository/merchantRepository"
import MerchantModel from "../../infra/database/models/mongoose/merchantModel"
import log from "../../interface/http/utils/logger"
const cloudinary = require('../../infra/libs/cloudinary')
const fs = require('fs')


class UploadBanner{
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
            
            const uploader = async (path: String) => await cloudinary.uploads(path , 'youstore-store-banners')
            const url = []
            const file = payload

            const {path} = file
            const newPath = await uploader(path)

            url.push(newPath.url)
        
            fs.unlinkSync(path)

            const merchant = await MerchantModel.findOne({_id:merchantId})

            merchant!.storeBanner = url.toString()

            await merchant?.save()

            return merchant
          
        } catch (error) {
            throw error
        }
    }
}

export default UploadBanner