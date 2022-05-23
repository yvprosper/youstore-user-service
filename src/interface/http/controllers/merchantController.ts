import { Request, Response } from "express";
import HTTP_STATUS from "http-status-codes"
import { createMerchantSchema } from "../validations/merchantValidations";
import CreateMerchant from "../../../usecases/merchants/createMerchant";
import GetMerchant from "../../../usecases/merchants/getMerchant";
import UpdateMerchant from "../../../usecases/merchants/updateMerchant";
import DeleteMerchant from "../../../usecases/merchants/deleteMerchant";
import MerchantRepository from "../../../infra/repository/merchantRepository";
import GetMerchants from "../../../usecases/merchants/getMerchants";
import UploadPhoto from "../../../usecases/merchants/uploadPhoto";
import UploadBanner from "../../../usecases/merchants/uploadBanner";



class MerchantController {
    createMerchant: CreateMerchant
    getMerchant: GetMerchant
    getMerchants: GetMerchants
    deleteMerchant: DeleteMerchant
    updateMerchant: UpdateMerchant
    uploadPhoto: UploadPhoto
    merchantRepository: MerchantRepository
    uploadBanner: UploadBanner
    constructor({createMerchant, merchantRepository, getMerchant , getMerchants, updateMerchant, deleteMerchant, uploadPhoto, uploadBanner}: 
        {createMerchant: CreateMerchant, getMerchant: GetMerchant, updateMerchant: UpdateMerchant, deleteMerchant: DeleteMerchant
        getMerchants: GetMerchants, merchantRepository: MerchantRepository, uploadPhoto: UploadPhoto, uploadBanner: UploadBanner}) {
        this.createMerchant = createMerchant
        this.getMerchant = getMerchant
        this.getMerchants = getMerchants
        this.updateMerchant = updateMerchant
        this.deleteMerchant = deleteMerchant
        this.uploadPhoto = uploadPhoto
        this.uploadBanner = uploadBanner
        this.merchantRepository = merchantRepository
    } 


    async create(req: Request , res: Response) {
        try {
            const {error} = createMerchantSchema(req.body)
            if (error) return res.status(400).json({success: false , msg: error.details[0].message})

            const payload = req.body
            const merchant = await this.createMerchant.execute(payload)
            const user = {
                _id: merchant?._id,
                storeName: merchant?.storeName,
                address: merchant?.address,
                avatar: merchant?.avatar,
                phoneNo: merchant?.phoneNo,
                email: merchant?.email,
                bankName: merchant?.bankName,
                accountName: merchant?.accountName,
                accountNo: merchant?.accountNo,
                isVerified: merchant?.isVerified,
                createdAt: merchant?.createdAt,
                updatedAt: merchant?.updatedAt
            }
            res.status(HTTP_STATUS.CREATED).json({success: true , msg:`Merchant account successfully created`,  data: user})
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
            const merchantId = req.user._id
            const merchant = await this.getMerchant.execute(merchantId)
            res.status(HTTP_STATUS.OK).json({success: true , msg:`Merchant details successfully retrieved`, data:  merchant})
        }catch (error){
            if (error instanceof Error ) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`${error.message}`})
                throw new Error(`${error.message}`)
            } 
            throw error
        }
    }

    async getOne(req: Request , res: Response) {
        try {
            const merchantId = req.params.merchantId
            const merchant = await this.getMerchant.execute(merchantId)
            res.status(HTTP_STATUS.OK).json({success: true , msg:`Merchant details successfully retrieved`, data:  merchant})
        }catch (error){
            if (error instanceof Error ) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`${error.message}`})
                throw new Error(`${error.message}`)
            } 
            throw error
        }
    }


    async getAll(req: Request , res: Response) {
        try {
            const payload = req.query
            const merchants = await this.getMerchants.execute(payload)
            res.status(200).json({success: true , msg:`merchants successfully retrieved`,  data: merchants})
        }catch (error){
            if (error instanceof Error ) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({success: false , msg:`${error.message}`})
                throw new Error(`${error.message}`)
            } 
            throw error
        }
    }

    async getCategory(req: Request , res: Response) {
        try {
            const {category, page, limit} = req.query
            const merchants = await this.getMerchants.execute({category, page, limit,filter:true})
            res.status(200).json({success: true , msg:`merchants successfully retrieved`,  data: merchants})
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
            const merchantId = req.user._id
            const payload = req.body
            const merchant = await this.updateMerchant.execute(merchantId, payload)
            const user = {
                _id: merchant!._id,
                storeName: merchant!.storeName,
                address: merchant!.address,
                avatar: merchant!.avatar,
                storeBanner: merchant!.storeBanner,
                phoneNo: merchant!.phoneNo,
                email: merchant!.email,
                bankName: merchant!.bankName,
                accountName: merchant!.accountName,
                accountNo: merchant!.accountNo,
                isVerified: merchant!.isVerified,
                category: merchant!.category,
                orderFufillmentRate: merchant!.orderFufillmentRate,
                customerRating: merchant!.customerRating,
                createdAt: merchant!.createdAt,
                updatedAt: merchant!.updatedAt
            }
            res.status(200).json({success: true , msg:`Merchant details successfully updated`, data:  user})
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
            const merchantId = req.user._id
            await this.deleteMerchant.execute(merchantId)
            res.status(200).json({success: true , msg:`Merchant details successfully removed from database`})
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
            const merchantId = req.user._id
            const payload = req.file
            const merchant = await this.uploadPhoto.execute(payload, merchantId)
            const user = {
                _id: merchant!._id,
                storeName: merchant!.storeName,
                address: merchant!.address,
                avatar: merchant!.avatar,
                storeBanner: merchant!.storeBanner,
                phoneNo: merchant!.phoneNo,
                email: merchant!.email,
                bankName: merchant!.bankName,
                accountName: merchant!.accountName,
                accountNo: merchant!.accountNo,
                isVerified: merchant!.isVerified,
                createdAt: merchant!.createdAt,
                updatedAt: merchant!.updatedAt
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

    async uploadStoreBanner(req: Request , res: Response) {
        try {
            const merchantId = req.user._id
            const payload = req.file
            const merchant = await this.uploadBanner.execute(payload, merchantId)
            const user = {
                _id: merchant!._id,
                storeName: merchant!.storeName,
                address: merchant!.address,
                avatar: merchant!.avatar,
                storeBanner: merchant!.storeBanner,
                phoneNo: merchant!.phoneNo,
                email: merchant!.email,
                bankName: merchant!.bankName,
                accountName: merchant!.accountName,
                accountNo: merchant!.accountNo,
                isVerified: merchant!.isVerified,
                createdAt: merchant!.createdAt,
                updatedAt: merchant!.updatedAt
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

export default MerchantController