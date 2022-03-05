import bcrypt from "bcrypt"
import MerchantRepository from "../../infra/repository/merchantRepository"
import MerchantModel from "../../infra/database/models/mongoose/merchantModel"
import log from "../../interface/http/utils/logger"
import { changePasswordValidation } from "../../interface/http/validations/customerValidations"
import { MerchantDocument } from "../../infra/database/models/mongoose/merchantModel"
import { IchangePassword } from "../../interface/http/validations/customerValidations"
import Config from "config"


 class ChangeMerchantPassword{
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

    async execute(merchantId: String, payload: IchangePassword) {
        try {
            const {oldPassword, newPassword} = payload

            // Schema validation
            const {error} = changePasswordValidation({oldPassword, newPassword})
            if (error)  throw new Error(` ${error.details[0].message}`)

            //checking if merchant is registered and if oldPassword is correct
            const merchant: MerchantDocument | null = await this.merchantModel.findOne({_id: merchantId})
            if (!merchant) throw new Error('Merchant with this ID not found')

            // comparing oldPassword with current password in our database
            const validPassword = await bcrypt.compare(oldPassword , merchant.password) 
            if (!validPassword) throw new Error(`your old password is incorrect`)
                  
            // hashing newPassword and changing the password to the new password
            const hashPassword = await bcrypt.hash(newPassword , 12) 
            merchant.password = hashPassword
            await merchant.save()

            return merchant

        } catch (error) {
            throw error
        }

    }
}

export default ChangeMerchantPassword