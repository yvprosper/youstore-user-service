import AdminRepository from "../../infra/repository/adminRepository"
import log from "../../interface/http/utils/logger"
import AdminModel from "../../infra/database/models/mongoose/adminModel"


class UnBanAdmin{
    adminRepository: AdminRepository
    logger: typeof log
    adminModel: typeof AdminModel
    constructor({adminRepository, logger, adminModel}: {adminRepository: AdminRepository,adminModel: typeof AdminModel, logger: typeof log}) {
        this.adminRepository = adminRepository
        this.adminModel = adminModel
        this.logger = logger
    }

    async unban(email: String) {
        try {
            let admin = await this.adminModel.findOne({email: email})
            if (admin!.isRestricted) {
                admin!.isRestricted = false
                await admin!.save()
            }        
            return admin
        } catch (error) {
            throw error
        }
    }

}

export default UnBanAdmin