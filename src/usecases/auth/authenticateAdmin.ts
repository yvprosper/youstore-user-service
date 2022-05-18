import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import AdminRepository from "../../infra/repository/adminRepository"
import AdminModel from "../../infra/database/models/mongoose/adminModel"
import log from "../../interface/http/utils/logger"
import { signInValidation } from "../../interface/http/validations/customerValidations"
import { AdminDocument} from "../../infra/database/models/mongoose/adminModel"
import { Iauth } from "../../interface/http/validations/customerValidations"
import Config from "config"


 class AuthenticateAdmin{
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

    async execute({email, password}: Iauth) {
        try {
            // Schema validation
            const {error} = signInValidation({email, password})
            if (error)  throw new Error(` ${error.details[0].message}`)

            //checking if admin is registered
            const admin: AdminDocument | null = await this.adminModel.findOne({email: email})

            if (!admin) throw new Error('Your email or password is incorrect')
                  
             // verifying customer password with the one in our database
            const validPass = await bcrypt.compare(password , admin.password) 
            if (!validPass) throw new Error('Your email or password is incorrect')

            //checking if the admin's account is disabled
            if (admin.isRestricted) throw new Error('Your account has been temporarily disabled, contact support')
     
            //  generating jwt token
            const token = await jwt.sign({
                _id: admin._id, 
                firstName: admin.firstName, 
                lastName: admin.lastName, 
                avatar: admin.avatar, 
                email: admin.email,
                phoneNo: admin.phoneNo,
                role: admin.role,
                permissions: admin.permissions,
                isVerified: admin.hasCompletedSignUp
            }, this.config.get('adminSecret'));

            return {token, admin}
        } catch (error) {
            throw error
        }
    }
}

export default AuthenticateAdmin