import AdminRepository from "../../infra/repository/adminRepository"
import { AdminDocument } from "../../infra/database/models/mongoose/adminModel"
import log from "../../interface/http/utils/logger"
import {completeSignUpSchema} from "../../interface/http/validations/adminValidations"


class CompleteSignUp{
    adminRepository: AdminRepository
    logger: typeof log
    constructor({adminRepository, logger}: {adminRepository: AdminRepository, logger: typeof log}) {
        this.adminRepository = adminRepository
        this.logger = logger
    }

    async execute(payload: AdminDocument) {
        try {
            //validating user input
            const {error} = completeSignUpSchema(payload)
            if (error)  throw new Error(` ${error.details[0].message}`)

            const admin = await this.adminRepository.completeSignUp(payload)
            return admin
        } catch (error) {
            throw error
        }
    }
}

export default CompleteSignUp