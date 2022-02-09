import MerchantRepository from "../../infra/repository/merchantRepository"
import log from "../../interface/http/utils/logger"


class GetMerchant{
    merchantRepository: MerchantRepository
    logger: typeof log
    constructor({merchantRepository, logger}: {merchantRepository: MerchantRepository, logger: typeof log}) {
        this.merchantRepository = merchantRepository
        this.logger = logger
    }

    async execute(merchantId: String) {
        try {
            const merchant = await this.merchantRepository.get(merchantId)
            return merchant
        } catch (error) {
            this.logger.error(error)
        }
    }
}

export default GetMerchant