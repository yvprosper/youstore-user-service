import MerchantRepository from "../../infra/repository/merchantRepository"
import log from "../../interface/http/utils/logger"
import MerchantModel from "../../infra/database/models/mongoose/merchantModel"


class RestrictMerchant{
    merchantRepository: MerchantRepository
    logger: typeof log
    merchantModel: typeof MerchantModel
    constructor({merchantRepository, merchantModel, logger}: {merchantRepository: MerchantRepository, merchantModel: typeof MerchantModel, logger: typeof log}) {
        this.merchantRepository = merchantRepository
        this.merchantModel = merchantModel
        this.logger = logger
    }

    async temporary(email: String) {
        try {
            let merchant = await this.merchantModel.findOne({email: email})
            if (merchant.isRestricted) throw new Error('This merchant has already been restricted')
            merchant.isRestricted = true
            await merchant.save()
            return merchant
        } catch (error) {
            throw error
        }
    }

    async permanent(email: String) {
        try {
            let merchant = await this.merchantModel.findOneAndDelete({email: email})
            if (!merchant) throw new Error('No merchant with this email') 
            return merchant
        } catch (error) {
            throw error
        }
    }
}

export default RestrictMerchant