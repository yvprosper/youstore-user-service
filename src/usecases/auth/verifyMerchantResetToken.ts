import MerchantRepository from "../../infra/repository/merchantRepository"
import MerchantModel from "../../infra/database/models/mongoose/merchantModel"
import log from "../../interface/http/utils/logger"
import { MerchantDocument } from "../../infra/database/models/mongoose/merchantModel"
import Config from "config"
import jwt from "jsonwebtoken"
import Messenger from "../../infra/libs/rabbitmq";
import bcrypt from "bcrypt"
import { resetPasswordValidation, IresetPassword } from "../../interface/http/validations/customerValidations"

 class VerifyMerchantResetToken{
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

    async execute(merchantId: string, token: string, body: IresetPassword) {
        const {newPassword, confirmPassword} = body
            // Schema validation
            const {error} = resetPasswordValidation({confirmPassword, newPassword})
            if (error)  throw new Error(` ${error.details[0].message}`) 

            //checking if merchant is registered 
            const merchant: MerchantDocument | null = await this.merchantModel.findOne({_id: merchantId})
            if (!merchant) throw new Error('Merchant with this ID not found')

            // verifying the reset token
            const secret = this.config.get('merchantReset') + merchant.password
            const payload =  jwt.verify(token, secret)
            if (!payload) throw new Error('Invalid Token')


            // check if newPassword and confirmPassword are thesame
            if(newPassword !== confirmPassword) throw new Error('password mismatch!')
            

            // hashing newPassword and changing the password to the new password
            const hashPassword = await bcrypt.hash(newPassword , 12) 
            merchant.password = hashPassword
            await merchant.save()


            return merchant
        }
    }

export default VerifyMerchantResetToken