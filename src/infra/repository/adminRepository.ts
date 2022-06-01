import bcrypt from "bcrypt"
import { AdminDocument } from "../database/models/mongoose/adminModel"
import {superAdminPermissions,adminPermissions,managerPermissions} from "../../interface/http/utils/permissions"
import AdminModel from "../database/models/mongoose/adminModel"
import log from "../../interface/http/utils/logger"
import Messenger from "../libs/rabbitmq" 
import Config from "config"



  class AdminRepository {
    adminModel: typeof AdminModel
    logger: typeof log
    messenger: Messenger
    config: typeof Config
    constructor({adminModel, logger , messenger, config}: {adminModel: typeof AdminModel, logger: typeof log, messenger: Messenger, config: typeof Config}){
        this.adminModel = adminModel
        this.logger = logger
        this.messenger = messenger
        this.config = config
    }

    async signUp (payload: AdminDocument) {
        try {
            let { email, role } = payload
            
            let admin = await this.adminModel.create({ email, role});
            

            //add permissions
            if (admin.role == 'superAdmin') {
                admin.permissions = superAdminPermissions[0].permissions
            } else if (admin.role == 'admin') {
                admin.permissions = adminPermissions[0].permissions
            } else {
                admin.permissions = managerPermissions[0].permissions
            }

            const saveAdmin = await admin.save()

            //send to Queue
            this.messenger.sendToQueue(`new_admin_notification`, saveAdmin)

            return saveAdmin
            
        } catch (error) {
           throw error 
        }
    }

    async completeSignUp (payload: AdminDocument) {
            try {
                let {firstName, lastName, phoneNo, email , password} = payload

                let admin = await this.adminModel.findOne({email: email})
                if(!admin) return new Error(`No admin found with this email`)

                if (admin.phoneNo == phoneNo) throw new Error('phone number must be unique please change your phoneNo and try again')


                const hashedPassword= await bcrypt.hash(password , 12)
                password = hashedPassword

                const updatedAdmin = await this.adminModel.findOneAndUpdate({_id: admin._id}, {firstName, lastName, phoneNo, password, hasCompletedSignUp: true}, {
                    new: true
                } )
                
                return updatedAdmin
                
            } catch (error) {
               throw error 
            }
    }

    async get (adminId: String) {
            try {
                const admin = await this.adminModel.findById(adminId, {password: 0})
                if(!admin) throw new Error('Admin with this ID does not exist')
                return admin
            } catch (error) {
                throw error
                
            }
    }


    async getAll (payload: any) {
        try {
            const {page = 1 , limit = 10 } = payload;
            const admins = await this.adminModel.find({hasCompletedSignUp: true}, {password: 0}).limit(limit * 1).skip((page - 1) * limit)
            return admins
        } catch (error) {
           throw error
            
        }
    }


    async update (adminId: String, payload: AdminDocument) {
        try {
            const admin = await this.adminModel.findOneAndUpdate({_id: adminId}, payload, {
                new: true
            } )

            if(!admin) throw new Error('Admin with this ID does not exist')

            return admin
        } catch (error) {
            throw error
        }
    }


    async delete (adminId: String) {
            try {
                const admin = await this.adminModel.findOneAndDelete({_id: adminId})
                if(!admin) throw new Error('Admin with this ID does not exist')

                return admin
            } catch (error) {
                throw error
                
            }
    }

}

export default AdminRepository