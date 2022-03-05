import conflictError from "../../interface/http/errors/conflict"
import HTTP_STATUS from "http-status-codes"
import { createMerchantSchema } from "../../interface/http/validations/merchantValidations"
import MerchantRepository from "../../infra/repository/merchantRepository"
import MerchantModel from "../../infra/database/models/mongoose/merchantModel"
import { MerchantDocument } from "../../infra/database/models/mongoose/merchantModel"
import log from "../../interface/http/utils/logger"


 class CreateMerchant{
    merchantRepository: MerchantRepository
    logger: typeof log
    merchantModel: typeof MerchantModel
    constructor({merchantRepository, logger, merchantModel}: {merchantRepository: MerchantRepository, merchantModel: typeof MerchantModel, logger: typeof log}) {
        this.merchantRepository = merchantRepository
        this.logger = logger
        this.merchantModel = merchantModel
    }

    async execute(payload: MerchantDocument) {
        try {
            //validating user input
            const {error} = createMerchantSchema(payload)
            if (error)  throw new Error(` ${error.details[0].message}`)


            const {email} = payload

            //checking merchant already exist
            const alreadyExist = await this.merchantModel.findOne({email: email})
            if (alreadyExist) throw new conflictError('A Merchant with this Email already exist',HTTP_STATUS.CONFLICT,`error`)
            
            const merchant = await this.merchantRepository.create(payload)
            return merchant
          
        } catch (error) {
            
            throw error
        }
    }
}

export default CreateMerchant