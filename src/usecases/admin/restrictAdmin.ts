import AdminRepository from "../../infra/repository/adminRepository"
import log from "../../interface/http/utils/logger"
import AdminModel from "../../infra/database/models/mongoose/adminModel"


class RestrictAdmin{
    adminRepository: AdminRepository
    logger: typeof log
    adminModel: typeof AdminModel
    constructor({adminRepository, logger, adminModel}: {adminRepository: AdminRepository,adminModel: typeof AdminModel, logger: typeof log}) {
        this.adminRepository = adminRepository
        this.adminModel = adminModel
        this.logger = logger
    }

    async temporary(email: String) {
        try {
            let admin = await this.adminModel.findOne({email: email})
            if (admin!.isRestricted) throw new Error('This admin has already been restricted')
            admin!.isRestricted = true
            await admin!.save()
            return admin
        } catch (error) {
            throw error
        }
    }

    async permanent(email: String) {
        try {
            let admin = await this.adminModel.findOneAndDelete({email: email})
            if (!admin) throw new Error('No admin with this email') 
            return admin
        } catch (error) {
            throw error
        }
    }
}

export default RestrictAdmin