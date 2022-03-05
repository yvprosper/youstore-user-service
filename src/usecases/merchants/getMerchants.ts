import MerchantRepository from "../../infra/repository/merchantRepository"
import log from "../../interface/http/utils/logger"


class GetMerchants{
    merchantRepository: MerchantRepository
    logger: typeof log
    constructor({merchantRepository, logger}: {merchantRepository: MerchantRepository, logger: typeof log}) {
        this.merchantRepository = merchantRepository
        this.logger = logger
    }

    async execute(payload: Object) {
        try {
           const merchants =  await this.merchantRepository.getAll(payload)
           return merchants
        } catch (error) {
            throw error
        }
    }
}

export default GetMerchants