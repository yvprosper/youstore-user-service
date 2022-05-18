import MerchantRepository from "../../infra/repository/merchantRepository"
import log from "../../interface/http/utils/logger"
import MerchantModel from "../../infra/database/models/mongoose/merchantModel"


class UnBanMerchant{
    merchantRepository: MerchantRepository
    logger: typeof log
    merchantModel: typeof MerchantModel
    constructor({merchantRepository, merchantModel, logger}: {merchantRepository: MerchantRepository, merchantModel: typeof MerchantModel, logger: typeof log}) {
        this.merchantRepository = merchantRepository
        this.merchantModel = merchantModel
        this.logger = logger
    }

    async unban(email: String) {
        try {
            let merchant = await this.merchantModel.findOne({email: email})
            if (merchant.isRestricted) {
                merchant.isRestricted = false
                await merchant.save()
            }
            
            return merchant
        } catch (error) {
            throw error
        }
    }

}

export default UnBanMerchant