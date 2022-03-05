import MerchantRepository from "../../infra/repository/merchantRepository"
import { MerchantDocument } from "../../infra/database/models/mongoose/merchantModel"
import log from "../../interface/http/utils/logger"
import { updateMerchantSchema } from "../../interface/http/validations/merchantValidations"


class UpdateMerchant{
    merchantRepository: MerchantRepository
    logger: typeof log
    constructor({merchantRepository, logger}: {merchantRepository: MerchantRepository, logger: typeof log}) {
        this.merchantRepository = merchantRepository
        this.logger = logger
    }

    async execute(merchantId: String, payload: MerchantDocument) {
        try {
            const {password, email} = payload
            if (password || email) throw new Error (`you cannot change password or email with this route`)

            //validating user input
            const {error} = updateMerchantSchema(payload)
            if (error)  throw new Error(` ${error.details[0].message}`)
            
            const merchant = await this.merchantRepository.update(merchantId, payload)
            return merchant
        } catch (error) {
            throw error
        }
    }
}

export default UpdateMerchant