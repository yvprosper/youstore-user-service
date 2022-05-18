import AdminRepository from "../../infra/repository/adminRepository"
import log from "../../interface/http/utils/logger"


class GetAdmin{
    adminRepository: AdminRepository
    logger: typeof log
    constructor({adminRepository, logger}: {adminRepository: AdminRepository, logger: typeof log}) {
        this.adminRepository = adminRepository
        this.logger = logger
    }

    async execute(adminId: String) {
        try {
            const admin = await this.adminRepository.get(adminId)
            return admin
        } catch (error) {
            throw error
        }
    }
}

export default GetAdmin