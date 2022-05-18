import AdminRepository from "../../infra/repository/adminRepository"
import log from "../../interface/http/utils/logger"
import MerchantRepository from "../../infra/repository/merchantRepository"
import CustomerRepository from "../../infra/repository/customerRepository"


class GetOneUser{
    adminRepository: AdminRepository
    merchantRepository: MerchantRepository
    customerRepository: CustomerRepository
    logger: typeof log
    constructor({adminRepository,merchantRepository,customerRepository, logger}: {adminRepository: AdminRepository,merchantRepository: MerchantRepository,customerRepository: CustomerRepository, logger: typeof log}) {
        this.adminRepository = adminRepository
        this.merchantRepository = merchantRepository
        this.customerRepository = customerRepository
        this.logger = logger
    }

    async execute(userId: String, userType: any) {
        try {
            if (userType == 'admin') {
                const admin =  await this.adminRepository.get(userId)
                return admin
            } else if (userType == 'merchant') {
                const merchant =  await this.merchantRepository.get(userId)
                return merchant
            } else if (userType == 'admin') {
                const customer =  await this.customerRepository.get(userId)
                return customer
            } else throw new Error(`request query userType must be either "merchant" or "customer" or "admin"`)
           
           
        } catch (error) {
            throw error
        }
    }
}

export default GetOneUser