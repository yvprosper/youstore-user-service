import MerchantRepository from "../../infra/repository/merchantRepository"
import MerchantModel from "../../infra/database/models/mongoose/merchantModel"
import log from "../../interface/http/utils/logger"
import { MerchantDocument } from "../../infra/database/models/mongoose/merchantModel"
import Config from "config"
import jwt from "jsonwebtoken"
import Messenger from "../../infra/libs/rabbitmq";

 class ResetMerchantPassword{
    merchantRepository: MerchantRepository
    logger: typeof log
    merchantModel: typeof MerchantModel
    config: typeof Config
    messenger: Messenger
    constructor({merchantRepository, logger, merchantModel , config, messenger}: 
        {merchantRepository: MerchantRepository, merchantModel: typeof MerchantModel, logger: typeof log, config: typeof Config, messenger: Messenger}) {
        this.merchantRepository = merchantRepository
        this.logger = logger
        this.merchantModel = merchantModel
        this.config = config
        this.messenger = messenger
    }

    async execute(email: String) {

            //checking if merchant is registered 
            const merchant: MerchantDocument | null = await this.merchantModel.findOne({email: email})
            if (!merchant) throw new Error('Merchant with this EMAIL not found')

            // creating a reset token
            const secret = this.config.get('merchantReset') + merchant.password
            const payload = {
                email: merchant.email,
                id: merchant._id
            }
            const token = jwt.sign(payload, secret, {expiresIn: '10m'})
                  
            // creating a reset link
            const link = `https://youstore-users.herokuapp.com/v1/auth/merchant/reset-password/${merchant._id}/${token}`

            this.messenger.sendToQueue(`reset_merchant_password`, {merchant, link})

            return  link
        }
    }

export default ResetMerchantPassword