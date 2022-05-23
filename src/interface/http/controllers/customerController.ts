import { Request, Response } from "express";
import _pick from "lodash/pick";
import HTTP_STATUS from "http-status-codes"
import CreateCustomer from "../../../usecases/customers/createCustomer";
import GetCustomer from "../../../usecases/customers/getCustomer";
import UpdateCustomer from "../../../usecases/customers/updateCustomer";
import DeleteCustomer from "../../../usecases/customers/deleteCustomer";
import CustomerRepository from "../../../infra/repository/customerRepository";
import GetCustomers from "../../../usecases/customers/getCustomers";
import UploadAvatar from "../../../usecases/customers/uploadAvatar";
import { CustomerDocument } from "../../../infra/database/models/mongoose/customerModel";
class CustomerController {
    createCustomer: CreateCustomer
    getCustomer: GetCustomer
    getCustomers: GetCustomers
    deleteCustomer: DeleteCustomer
    updateCustomer: UpdateCustomer
    uploadAvatar: UploadAvatar
    customerRepository: CustomerRepository
    constructor({createCustomer, customerRepository, getCustomer , getCustomers, updateCustomer, deleteCustomer, uploadAvatar}: 
        {createCustomer: CreateCustomer, getCustomer: GetCustomer, updateCustomer: UpdateCustomer, deleteCustomer: DeleteCustomer
        getCustomers: GetCustomers, customerRepository: CustomerRepository, uploadAvatar: UploadAvatar}) {
        this.createCustomer = createCustomer
        this.getCustomer = getCustomer
        this.getCustomers = getCustomers
        this.updateCustomer = updateCustomer
        this.deleteCustomer = deleteCustomer
        this.uploadAvatar = uploadAvatar
        this.customerRepository = customerRepository
    } 


    async create(req: Request , res: Response) {
        try {
            const payload = req.body
            const customer = await this.createCustomer.execute(payload)
            const user = {
                _id: customer?._id,
                firstName: customer?.firstName,
                lastName: customer?.lastName,
                address: customer?.address,
                avatar: customer?.avatar,
                phoneNo: customer?.phoneNo,
                email: customer?.email,
                isVerified: customer?.isVerified,
                createdAt: customer?.createdAt,
                updatedAt: customer?.updatedAt
            }
            res.status(HTTP_STATUS.CREATED).json({success: true , msg:`Customer account successfully created`,  data: user})
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
            const customerId = req.user._id
            const customer = await this.getCustomer.execute(customerId)
            res.status(HTTP_STATUS.OK).json({success: true , msg:`Customer details successfully retrieved`, data:  customer})
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
            const customers = await this.getCustomers.execute(payload)
            res.status(200).json({success: true , msg:`AllCustomer details successfully retrieved`, data:  customers})
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
            const customerId = req.user._id
            const payload = req.body
            const customer: CustomerDocument | undefined = await this.updateCustomer.execute(customerId, payload)
            
            const user = {
                _id: customer!._id,
                firstName: customer!.firstName,
                lastName: customer!.lastName,
                address: customer!.address,
                avatar: customer!.avatar,
                phoneNo: customer!.phoneNo,
                email: customer!.email,
                isVerified: customer!.isVerified,
                createdAt: customer!.createdAt,
                updatedAt: customer!.updatedAt
            }
            res.status(200).json({success: true , msg:`Customer details successfully updated`, data:  user})
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
            const customerId = req.user._id
            await this.deleteCustomer.execute(customerId)
            res.status(200).json({success: true , msg:`Customer details successfully removed from database`})
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
            const customerId = req.user._id
            const payload = req.file
            const customer = await this.uploadAvatar.execute(payload, customerId)

            const user = {
                _id: customer!._id,
                firstName: customer!.firstName,
                lastName: customer!.lastName,
                address: customer!.address,
                avatar: customer!.avatar,
                phoneNo: customer!.phoneNo,
                email: customer!.email,
                isVerified: customer!.isVerified,
                createdAt: customer!.createdAt,
                updatedAt: customer!.updatedAt
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

export default CustomerController