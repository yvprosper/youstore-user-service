import AdminRepository from "../../infra/repository/adminRepository"
import AdminModel from "../../infra/database/models/mongoose/adminModel"
import log from "../../interface/http/utils/logger"
const cloudinary = require('../../infra/libs/cloudinary')
const fs = require('fs')


class UploadAdminAvatar{
    adminRepository: AdminRepository
    logger: typeof log
    adminModel: typeof AdminModel
    constructor({adminRepository, logger, adminModel}: {adminRepository: AdminRepository, adminModel: typeof AdminModel, logger: typeof log}) {
        this.adminRepository = adminRepository
        this.logger = logger
        this.adminModel = adminModel
    }

    async execute(payload: any, adminId: String) {
        try {
            
            const uploader = async (path: String) => await cloudinary.uploads(path , 'youstore-admin-photos')
            const url = []
            const file = payload

            const {path} = file
            const newPath = await uploader(path)
            

            url.push(newPath.url)
        
            fs.unlinkSync(path)

            const admin = await AdminModel.findOne({_id:adminId})

            admin!.avatar = url.toString()

            await admin?.save()

            return admin
          
        } catch (error) {
            throw error
        }
    }
}

export default UploadAdminAvatar