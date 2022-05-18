import AdminRepository from "../../infra/repository/adminRepository"
import AdminModel from "../../infra/database/models/mongoose/adminModel"
import log from "../../interface/http/utils/logger"
import { AdminDocument } from "../../infra/database/models/mongoose/adminModel"
import Config from "config"
import jwt from "jsonwebtoken"
import Messenger from "../../infra/libs/rabbitmq";
import bcrypt from "bcrypt"
import { resetPasswordValidation, IresetPassword } from "../../interface/http/validations/customerValidations"

 class VerifyAdminResetToken{
    adminRepository: AdminRepository
    logger: typeof log
    adminModel: typeof AdminModel
    config: typeof Config
    messenger: Messenger
    constructor({adminRepository, logger, adminModel , config, messenger}: 
        {adminRepository: AdminRepository, adminModel: typeof AdminModel, logger: typeof log, config: typeof Config, messenger: Messenger}) {
        this.adminRepository = adminRepository
        this.logger = logger
        this.adminModel = adminModel
        this.config = config
        this.messenger = messenger
    }

    async execute(adminId: string, token: string, body: IresetPassword) {
        try {
        const {newPassword, confirmPassword} = body
            // Schema validation
            const {error} = resetPasswordValidation({confirmPassword, newPassword})
            if (error)  throw new Error(` ${error.details[0].message}`) 

            //checking if admin is registered 
            const admin: AdminDocument | null = await this.adminModel.findOne({_id: adminId})
            if (!admin) throw new Error('Admin with this ID not found')

            // verifying the reset token
            const secret = this.config.get('adminReset') + admin.password
            const payload =  jwt.verify(token, secret)
            if (!payload) throw new Error('Invalid Token')


            // check if newPassword and confirmPassword are thesame
            if(newPassword !== confirmPassword) throw new Error('password mismatch!')
            

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

export default VerifyAdminResetToken