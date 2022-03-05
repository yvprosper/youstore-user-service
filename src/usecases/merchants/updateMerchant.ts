import MerchantRepository from "../../infra/repository/merchantRepository"
import { MerchantDocument } from "../../infra/database/models/mongoose/merchantModel"
import log from "../../interface/http/utils/logger"


class UpdateMerchant{
    merchantRepository: MerchantRepository
    logger: typeof log
    constructor({merchantRepository, logger}: {merchantRepository: MerchantRepository, logger: typeof log}) {
        this.merchantRepository = merchantRepository
        this.logger = logger
    }

    async execute(merchantId: String, payload: MerchantDocument) {
        try {
            const {password} = payload
            if (password) throw new Error (`you cannot change password with this route`)
            const merchant = await this.merchantRepository.update(merchantId, payload)
            return merchant
        } catch (error) {
            throw error
        }
    }
}

export default UpdateMerchant