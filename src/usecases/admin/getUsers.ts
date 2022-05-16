import AdminRepository from "../../infra/repository/adminRepository"
import log from "../../interface/http/utils/logger"
import MerchantRepository from "../../infra/repository/merchantRepository"
import CustomerRepository from "../../infra/repository/customerRepository"


class GetUsers{
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

    async execute(payload: Object, userType: any) {
        try {
            if (userType == 'admin') {
                const admins =  await this.adminRepository.getAll(payload)
                return admins
            } else if (userType == 'merchant') {
                const merchants =  await this.merchantRepository.getAll(payload)
                return merchants
            } else if (userType == 'admin') {
                const customers =  await this.customerRepository.getAll(payload)
                return customers
            } else return new Error(`request query userType must be either "merchant" or "customer" or "admin"`)
           
           
        } catch (error) {
            throw error
        }
    }
}

export default GetUsers