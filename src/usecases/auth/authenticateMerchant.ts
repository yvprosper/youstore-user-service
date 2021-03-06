import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import MerchantRepository from "../../infra/repository/merchantRepository"
import MerchantModel from "../../infra/database/models/mongoose/merchantModel"
import log from "../../interface/http/utils/logger"
import { signInValidation } from "../../interface/http/validations/customerValidations"
import { MerchantDocument } from "../../infra/database/models/mongoose/merchantModel"
import { Iauth } from "../../interface/http/validations/customerValidations"
import Config from "config"


 class AuthenticateMerchant{
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

    async execute({email, password}: Iauth) {
        try {
            // Schema validation
            const {error} = signInValidation({email, password})
            if (error)  throw new Error(` ${error.details[0].message}`)

            //checking if merchant is registered
            const merchant: MerchantDocument | null = await this.merchantModel.findOne({email: email})

            if (!merchant) throw new Error('Your email or password is incorrect')
                  
             // verifying merchant password with the one in our database
            const validPass = await bcrypt.compare(password , merchant.password) 
            if (!validPass) throw new Error('Your email or password is incorrect')

            //checking if the merchant's account is disabled
            if (merchant.isRestricted) throw new Error('Your account has been temporarily disabled, contact support')
            
     
            //  generating jwt token
            const token = await jwt.sign({
                _id: merchant._id,
                avatar: merchant.avatar, 
                address: merchant.address,
                email: merchant.email, 
                phoneNo: merchant.phoneNo,
                isVerified: merchant.isVerified, 
                storeName: merchant.storeName
            }, this.config.get('merchantSecret'));

            return {token, merchant}
        } catch (error) {
            throw error
        }
    }
}

export default AuthenticateMerchant