import AdminRepository from "../../infra/repository/adminRepository"
import AdminModel from "../../infra/database/models/mongoose/adminModel"
import log from "../../interface/http/utils/logger"
import { AdminDocument } from "../../infra/database/models/mongoose/adminModel"
import Config from "config"
import jwt from "jsonwebtoken"
import Messenger from "../../infra/libs/rabbitmq";

 class ResetAdminPassword{
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

    async execute(email: String) {
        try {
            //checking if admin is registered 
            const admin: AdminDocument | null = await this.adminModel.findOne({email: email})
            if (!admin) throw new Error('Admin with this EMAIL not found')

            // creating a reset token
            const secret = this.config.get('adminReset') + admin.password
            const payload = {
                email: admin.email,
                id: admin._id
            }
            const token = jwt.sign(payload, secret, {expiresIn: '10m'})
            
                  
            // creating a reset link
            const link = `https://youstore-users.herokuapp.com/v1/auth/admin/reset-password/${admin._id}/${token}`

            this.messenger.sendToQueue(`reset_customer_password`, {admin, link})

            return  link

        } catch (error) {
            throw error
        }

        }
    }

export default ResetAdminPassword