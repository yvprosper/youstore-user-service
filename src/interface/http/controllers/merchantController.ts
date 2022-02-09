import { Request, Response } from "express";
import HTTP_STATUS from "http-status-codes"
import { createMerchantSchema } from "../validations/merchantValidations";
import CreateMerchant from "../../../usecases/merchants/createMerchant";
import GetMerchant from "../../../usecases/merchants/getMerchant";
import UpdateMerchant from "../../../usecases/merchants/updateMerchant";
import DeleteMerchant from "../../../usecases/merchants/deleteMerchant";
import MerchantRepository from "../../../infra/repository/merchantRepository";
import GetMerchants from "../../../usecases/merchants/getMerchants";



class MerchantController {
    createMerchant: CreateMerchant
    getMerchant: GetMerchant
    getMerchants: GetMerchants
    deleteMerchant: DeleteMerchant
    updateMerchant: UpdateMerchant
    merchantRepository: MerchantRepository
    constructor({createMerchant, merchantRepository, getMerchant , getMerchants, updateMerchant, deleteMerchant}: 
        {createMerchant: CreateMerchant, getMerchant: GetMerchant, updateMerchant: UpdateMerchant, deleteMerchant: DeleteMerchant
        getMerchants: GetMerchants, merchantRepository: MerchantRepository}) {
        this.createMerchant = createMerchant
        this.getMerchant = getMerchant
        this.getMerchants = getMerchants
        this.updateMerchant = updateMerchant
        this.deleteMerchant = deleteMerchant
        this.merchantRepository = merchantRepository
    } 


    async create(req: Request , res: Response) {
        try {
            const {error} = createMerchantSchema(req.body)
            if (error) return res.status(400).json({success: false , msg: error.details[0].message})

            const payload = req.body
            const merchant = await this.createMerchant.execute(payload)
            const response = {
                _id: merchant?._id,
                fullName: merchant?.fullName,
                address: merchant?.address,
                avatar: merchant?.avatar,
                phoneNo: merchant?.phoneNo,
                email: merchant?.email,
                createdAt: merchant?.createdAt,
                updatedAt: merchant?.updatedAt
            }
            res.status(HTTP_STATUS.CREATED).json({success: true , msg:`Merchant account successfully created`,  data: response})
        }catch (error){
            let errMessage = "A Merchant with this Email already exist"
            if (error instanceof Error ) {
                error.message==errMessage
                res.status(HTTP_STATUS.CONFLICT).json({success: false , msg: `A Merchant with this Email already exist`})
            } 
            throw error
        }
    }

    async get(req: Request , res: Response) {
        try {
            const {merchantId} = req.params
            const merchant = await this.getMerchant.execute(merchantId)
            if (!merchant) return  res.status(400).json({success: false , msg: `Merchant with this ID not found`})
            res.status(HTTP_STATUS.OK).json({success: true , msg:`Merchant details successfully retrieved`, data:  merchant})
        }catch (error){
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({success: false , data: error})
        }
    }


    async getAll(req: Request , res: Response) {
        try {
            const payload = {}
            const merchants = await this.getMerchants.execute(payload)
            res.status(200).json({success: true , msg:`merchants successfully retrieved`,  data: merchants})
        }catch (error){
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({success: false , data: error})
        }
    }


    async update(req: Request , res: Response) {
        try {
            const {merchantId} = req.params
            const payload = req.body
            const merchant = await this.updateMerchant.execute(merchantId, payload)
            if (!merchant) return  res.status(400).json({success: false , msg: `Customer with this ID not found`})
            const response = {
                _id: merchant._id,
                fullName: merchant.fullName,
                storeName: merchant.storeName,
                address: merchant.address,
                avatar: merchant.avatar,
                phoneNo: merchant.phoneNo,
                email: merchant.email,
                createdAt: merchant.createdAt,
                updatedAt: merchant.updatedAt
            }
            res.status(200).json({success: true , msg:`Merchant details successfully updated`, data:  response})
        }catch (error){
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({success: false , data: error})
        }
    }


    async delete(req: Request , res: Response) {
        try {
            const {merchantId} = req.params
            const merchant = await this.deleteMerchant.execute(merchantId)
            if (!merchant) return  res.status(404).json({success: false , msg: `Merchant with this ID not found`})
            res.status(200).json({success: true , msg:`Merchant details successfully removed from database`})
        }catch (error){
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({success: false , data: error})
        }
    }

}

export default MerchantController