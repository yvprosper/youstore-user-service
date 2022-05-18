import AdminRepository from "../../infra/repository/adminRepository"
import { AdminDocument } from "../../infra/database/models/mongoose/adminModel"
import log from "../../interface/http/utils/logger"
import { updateAdminSchema } from "../../interface/http/validations/adminValidations"


class UpdateAdmin{
    adminRepository: AdminRepository
    logger: typeof log
    constructor({adminRepository, logger}: {adminRepository: AdminRepository, logger: typeof log}) {
        this.adminRepository = adminRepository
        this.logger = logger
    }

    async execute(adminId: String, payload: AdminDocument) {
        try {
            const {password, email} = payload
            if (password || email) throw new Error (`you cannot change password or email with this route`)

            //validating user input
            const {error} = updateAdminSchema(payload)
            if (error)  throw new Error(` ${error.details[0].message}`)

            const admin = await this.adminRepository.update(adminId, payload)
            return admin
        } catch (error) {
            throw error
        }
    }
}

export default UpdateAdmin