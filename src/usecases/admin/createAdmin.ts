import conflictError from "../../interface/http/errors/conflict"
import HTTP_STATUS from "http-status-codes"
import { createAdminSchema } from "../../interface/http/validations/adminValidations"
import AdminRepository from "../../infra/repository/adminRepository"
import AdminModel from "../../infra/database/models/mongoose/adminModel"
import { AdminDocument } from "../../infra/database/models/mongoose/adminModel"
import log from "../../interface/http/utils/logger"


 class CreateAdmin{
    adminRepository: AdminRepository
    logger: typeof log
    adminModel: typeof AdminModel
    constructor({adminRepository, logger, adminModel}: {adminRepository: AdminRepository, adminModel: typeof AdminModel, logger: typeof log}) {
        this.adminRepository = adminRepository
        this.logger = logger
        this.adminModel = adminModel
    }

    async execute(payload: AdminDocument) {
        try {
            //validating user input
            const {error} = createAdminSchema(payload)
            if (error)  throw new Error(` ${error.details[0].message}`)

            //checking if user already exist
            const {email} = payload

            const alreadyExist = await this.adminModel.findOne({email: email})
            if (alreadyExist) throw new conflictError('An Admin with this Email already exist',HTTP_STATUS.CONFLICT,`error`)

            const admin = await this.adminRepository.signUp(payload)
            return admin
          
        } catch (error) {
            throw error
        }
    }
}

export default CreateAdmin