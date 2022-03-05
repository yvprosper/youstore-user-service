import MerchantRepository from "../../infra/repository/merchantRepository"
import MerchantModel from "../../infra/database/models/mongoose/merchantModel"
import log from "../../interface/http/utils/logger"
import { MerchantDocument } from "../../infra/database/models/mongoose/merchantModel"
import Config from "config"
import jwt from "jsonwebtoken"

 class VerifyMerchantEmailToken{
    merchantRepository: MerchantRepository
    logger: typeof log
    merchantModel: typeof MerchantModel
    config: typeof Config
    constructor({merchantRepository, logger, merchantModel , config}: 
        {merchantRepository: MerchantRepository, merchantModel: typeof MerchantModel, logger: typeof log, config: typeof Config}) {
        this.merchantRepository = merchantRepository
        this.logger = logger
        this.merchantModel = merchantModel
        this.config = config
    }

    async execute(merchantId: string, token: string) {

            try {
            //checking if merchant is registered 
            const merchant: MerchantDocument | null = await this.merchantModel.findOne({_id: merchantId})
            if (!merchant) throw new Error('Merchant with this EMAIL not found')

            // verifying the reset token
            const secret = this.config.get('merchantEmailSecret') 
            const payload =  jwt.verify(token, `${secret}`)
            if (!payload) throw new Error('Invalid Token')
            
            // change verification status
            merchant.isVerified = true
            await merchant.save()

            return  merchant

        } catch (error) {
            throw error
        }
        
        }
    }

export default VerifyMerchantEmailToken