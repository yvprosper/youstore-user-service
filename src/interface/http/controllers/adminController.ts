import { Request, Response } from "express";
import _pick from "lodash/pick";
import HTTP_STATUS from "http-status-codes"
import CreateAdmin from "../../../usecases/admin/createAdmin";
import CompleteSignUp from "../../../usecases/admin/completeSignUp";
import UpdateAdmin from "../../../usecases/admin/updateAdmin";
import DeleteAdmin from "../../../usecases/admin/deleteAdmin";
import AdminRepository from "../../../infra/repository/customerRepository";
import GetUsers from "../../../usecases/admin/getUsers";
import GetOneUser from "../../../usecases/admin/getOneUser";
import RestrictAdmin from "../../../usecases/admin/restrictAdmin";
import RestrictMerchant from "../../../usecases/admin/restrictMerchant";
import UnBanAdmin from "../../../usecases/admin/unBanAdmin";
import UnBanMerchant from "../../../usecases/admin/unBanMerchant";
import UploadAdminAvatar from "../../../usecases/admin/uploadAdminAvatar";
import { AdminDocument } from "../../../infra/database/models/mongoose/adminModel";



class AdminController {
    createAdmin: CreateAdmin
    completeSignUp: CompleteSignUp
    getUsers: GetUsers
    getOneUser: GetOneUser
    deleteAdmin: DeleteAdmin
    updateAdmin: UpdateAdmin
    uploadAdminAvatar: UploadAdminAvatar
    adminRepository: AdminRepository
    restrictMerchant: RestrictMerchant
    restrictAdmin: RestrictAdmin
    unBanAdmin: UnBanAdmin
    unBanMerchant: UnBanMerchant
    constructor({createAdmin, adminRepository, completeSignUp , getUsers,getOneUser, updateAdmin, deleteAdmin,restrictMerchant,restrictAdmin,uploadAdminAvatar,unBanAdmin,unBanMerchant}: 
        {createAdmin: CreateAdmin, completeSignUp: CompleteSignUp, updateAdmin: UpdateAdmin, deleteAdmin: DeleteAdmin,unBanAdmin: UnBanAdmin, unBanMerchant: UnBanMerchant
        getUsers: GetUsers,getOneUser: GetOneUser, adminRepository: AdminRepository, uploadAdminAvatar: UploadAdminAvatar,restrictMerchant: RestrictMerchant, restrictAdmin: RestrictAdmin}) {
        this.createAdmin = createAdmin
        this.completeSignUp = completeSignUp
        this.getUsers = getUsers
        this.getOneUser = getOneUser
        this.updateAdmin = updateAdmin
        this.deleteAdmin = deleteAdmin
        this.uploadAdminAvatar = uploadAdminAvatar
        this.restrictMerchant = restrictMerchant
        this.restrictAdmin = restrictAdmin
        this.unBanAdmin = unBanAdmin
        this.unBanMerchant = unBanMerchant
        this.adminRepository = adminRepository
    } 


    async create(req: Request , res: Response) {
        try {
            const payload = req.body
            const admin = await this.createAdmin.execute(payload)
            const user = {
                _id: admin?._id,
                firstName: admin?.firstName,
                lastName: admin?.lastName,
                role: admin?.role,
                permissions: admin?.permissions,
                avatar: admin?.avatar,
                phoneNo: admin?.phoneNo,
                email: admin?.email,
                hasCompletedSignUp: admin?.hasCompletedSignUp,
                createdAt: admin?.createdAt,
                updatedAt: admin?.updatedAt
            }
            res.status(HTTP_STATUS.CREATED).json({success: true , msg:`Admin account successfully created`,  data: user})
        }catch (error){
            if (error instanceof Error ) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`${error.message}`})
                throw new Error(`${error.message}`)
            } 
            throw error
        }
    }

    async completeRegisteration(req: Request , res: Response) {
        try {
            const payload = req.body
            const admin: any = await this.completeSignUp.execute(payload)

            const user = {
                _id: admin?._id,
                firstName: admin?.firstName,
                lastName: admin?.lastName,
                role: admin?.role,
                permissions: admin?.permissions,
                avatar: admin?.avatar,
                phoneNo: admin?.phoneNo,
                email: admin?.email,
                hasCompletedSignUp: admin?.hasCompletedSignUp,
                createdAt: admin?.createdAt,
                updatedAt: admin?.updatedAt
            }
            res.status(HTTP_STATUS.OK).json({success: true , msg:`admin successfully completed signUp`, data:  user})
        }catch (error){
            if (error instanceof Error ) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`${error.message}`})
                throw new Error(`${error.message}`)
            } 
            throw error
        }
    }


    async getAllUsers(req: Request , res: Response) {
        try {
            const payload = {}
            const {userType} = req.query
            const users = await this.getUsers.execute(payload, userType)
            res.status(200).json({success: true , msg:`All ${userType} details successfully retrieved`, data:  users})
        }catch (error){
            if (error instanceof Error ) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`${error.message}`})
                throw new Error(`${error.message}`)
            } 
            throw error
        }
    }


    async getAllAdmins(req: Request , res: Response) {
        try {
            const payload = {}
            const userType = 'admin'
            const users = await this.getUsers.execute(payload, userType)
            res.status(200).json({success: true , msg:`All ${userType} details successfully retrieved`, data:  users})
        }catch (error){
            if (error instanceof Error ) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`${error.message}`})
                throw new Error(`${error.message}`)
            } 
            throw error
        }
    }


    async get(req: Request , res: Response) {
        try {
            const userId = req.params.userId
            const {userType} = req.query
            const user = await this.getOneUser.execute(userId, userType)
            res.status(HTTP_STATUS.OK).json({success: true , msg:`${userType} details successfully retrieved`, data:  user})
        }catch (error){
            if (error instanceof Error ) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`${error.message}`})
                throw new Error(`${error.message}`)
            } 
            throw error
        }
    }

    async sanctionMerchant(req: Request , res: Response) {
        try {
            const email = req.body.email
            const {type} = req.query

            if (type === `temporary`) {
                const user = await this.restrictMerchant.temporary(email)
                res.status(HTTP_STATUS.OK).json({success: true , msg:` Merchant with ID: ${user._id} has been temporarily restricted`, data:  user})
            } else if (type === `permanent`) {
                const user = await this.restrictMerchant.permanent(email)
                res.status(HTTP_STATUS.OK).json({success: true , msg:` Merchant with ID: ${user._id} has been disabled`, data:  user})
            } else {
                res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`Type can only be temporary or permanent`})
            }
              
        }catch (error){
            if (error instanceof Error ) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`${error.message}`})
                throw new Error(`${error.message}`)
            } 
            throw error
        }
    }


    async sanctionAdmin(req: Request , res: Response) {
        try {
            const email = req.body.email
            const {type} = req.query

            if (type === `temporary`) {
                const user = await this.restrictAdmin.temporary(email)
                res.status(HTTP_STATUS.OK).json({success: true , msg:` Admin with ID: ${user!._id} has been temporarily restricted`, data:  user})
            } else if (type === `permanent`) {
                const user = await this.restrictAdmin.permanent(email)
                res.status(HTTP_STATUS.OK).json({success: true , msg:` Admin with ID: ${user._id} has been disabled`, data:  user})
            } else {
                res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`Type can only be temporary or permanent`})
            }
              
        }catch (error){
            if (error instanceof Error ) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`${error.message}`})
                throw new Error(`${error.message}`)
            } 
            throw error
        }
    }


    async unRestrictAdmin(req: Request , res: Response) {
        try {
            const email = req.body.email
            const user = await this.unBanAdmin.unban(email)
            res.status(HTTP_STATUS.OK).json({success: true , msg:` Admin with ID: ${user!._id} has been unbanned`, data:  user})
              
        }catch (error){
            if (error instanceof Error ) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`${error.message}`})
                throw new Error(`${error.message}`)
            } 
            throw error
        }
    }


    async unRestrictMerchant(req: Request , res: Response) {
        try {
            const email = req.body.email
            const user = await this.unBanMerchant.unban(email)
            res.status(HTTP_STATUS.OK).json({success: true , msg:` Admin with ID: ${user!._id} has been unbanned`, data:  user})
              
        }catch (error){
            if (error instanceof Error ) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`${error.message}`})
                throw new Error(`${error.message}`)
            } 
            throw error
        }
    }


    async update(req: Request , res: Response) {
        try {
            const adminId = req.user._id
            const payload = req.body
            const admin: AdminDocument | undefined = await this.updateAdmin.execute(adminId, payload)
            
            const user = {
                _id: admin?._id,
                firstName: admin?.firstName,
                lastName: admin?.lastName,
                role: admin?.role,
                permissions: admin?.permissions,
                avatar: admin?.avatar,
                phoneNo: admin?.phoneNo,
                email: admin?.email,
                hasCompletedSignUp: admin?.hasCompletedSignUp,
                createdAt: admin?.createdAt,
                updatedAt: admin?.updatedAt
            }
            res.status(200).json({success: true , msg:`Admin details successfully updated`, data:  user})
        }catch (error){
            if (error instanceof Error ) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`${error.message}`})
                throw new Error(`${error.message}`)
            } 
            throw error
        }
    }


    async delete(req: Request , res: Response) {
        try {
            const adminId = req.user._id
            await this.deleteAdmin.execute(adminId)
            res.status(200).json({success: true , msg:`Admin details successfully removed from database`})
        }catch (error){
            if (error instanceof Error ) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`${error.message}`})
                throw new Error(`${error.message}`)
            } 
            throw error
        }
    }

    async upload(req: Request , res: Response) {
        try {
            const adminId = req.user._id
            const payload = req.file
            const admin = await this.uploadAdminAvatar.execute(payload, adminId)

            const user = {
                _id: admin?._id,
                firstName: admin?.firstName,
                lastName: admin?.lastName,
                role: admin?.role,
                permissions: admin?.permissions,
                avatar: admin?.avatar,
                phoneNo: admin?.phoneNo,
                email: admin?.email,
                hasCompletedSignUp: admin?.hasCompletedSignUp,
                createdAt: admin?.createdAt,
                updatedAt: admin?.updatedAt
            }
            res.status(200).json({success: true , msg:`Photo successfully uploaded`, data:  user})
        }catch (error){
            if (error instanceof Error ) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`${error.message}`})
                throw new Error(`${error.message}`)
            } 
            throw error
        }
    }


}

export default AdminController