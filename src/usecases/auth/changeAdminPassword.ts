import bcrypt from "bcrypt"
import AdminRepository from "../../infra/repository/adminRepository"
import AdminModel from "../../infra/database/models/mongoose/adminModel"
import log from "../../interface/http/utils/logger"
import { changePasswordValidation } from "../../interface/http/validations/customerValidations"
import { AdminDocument } from "../../infra/database/models/mongoose/adminModel"
import { IchangePassword } from "../../interface/http/validations/customerValidations"
import Config from "config"


 class ChangeAdminPassword{
    adminRepository: AdminRepository
    logger: typeof log
    adminModel: typeof AdminModel
    config: typeof Config
    constructor({adminRepository, logger, adminModel , config}: 
        {adminRepository: AdminRepository, adminModel: typeof AdminModel, logger: typeof log, config: typeof Config}) {
        this.adminRepository = adminRepository
        this.logger = logger
        this.adminModel = adminModel
        this.config = config
    }

    async execute(adminId: String, payload: IchangePassword) {
        try {
            const {oldPassword, newPassword} = payload

            // Schema validation
            const {error} = changePasswordValidation({oldPassword, newPassword})
            if (error)  throw new Error(` ${error.details[0].message}`)
        
            //checking if admin is registered
            const admin: AdminDocument | null = await this.adminModel.findOne({_id: adminId})
            if (!admin) throw new Error('Admin with this ID not found')

            // comparing oldPassword with current password in our database
            const validPassword = await bcrypt.compare(oldPassword , admin.password) 
            if (!validPassword) throw new Error(`your old password is incorrect`)
                  
            // hashing newPassword and changing the password to the new password
            const hashPassword = await bcrypt.hash(newPassword , 12) 
            admin.password = hashPassword
            await admin.save()

            return  admin
        } catch (error) {
            throw error
        }
        
        }
    }

export default ChangeAdminPassword