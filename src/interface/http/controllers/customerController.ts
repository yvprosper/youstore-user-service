import { Request, Response } from "express";

class CustomerController {
    createCustomer: any
    getCustomer: any
    getCustomers: any
    deleteCustomer: any
    updateCustomer: any
    customerRepository: any
    constructor({createCustomer, customerRepository, getCustomer , getCustomers, updateCustomer, deleteCustomer}: any) {
        this.createCustomer = createCustomer
        this.getCustomer = getCustomer
        this.getCustomers = getCustomers
        this.updateCustomer = updateCustomer
        this.deleteCustomer = deleteCustomer
        this.customerRepository = customerRepository
    } 


    async create(req: Request , res: Response) {
        try {
            const payload = req.body
            const customer = await this.createCustomer.execute(payload)
            res.status(200).json({success: true , msg:`Customer account successfully created`,  data: customer})
        }catch (error){
            res.status(400).json({success: false , data: error})
        }
    }

    async get(req: Request , res: Response) {
        try {
            const {customerId} = req.params
            const customer = await this.getCustomer.execute(customerId)
            res.status(200).json({success: true , msg:`Customer details successfully retrieved`, data:  customer})
        }catch (error){
            res.status(400).json({success: false , data: error})
        }
    }


    async getAll(req: Request , res: Response) {
        try {
            const payload = req.query
            const customers = await this.getCustomers.execute(payload)
            res.status(200).json({success: true , msg:`Customers successfully retrieved`,  data: customers})
        }catch (error){
            res.status(400).json({success: false , data: error})
        }
    }


    async update(req: Request , res: Response) {
        try {
            const {customerId} = req.params
            const payload = req.body
            const customer = await this.updateCustomer.execute(customerId, payload)
            res.status(200).json({success: true , msg:`Customer details successfully updated`, data:  customer})
        }catch (error){
            res.status(400).json({success: false , data: error})
        }
    }


    async delete(req: Request , res: Response) {
        try {
            const {customerId} = req.params
             await this.deleteCustomer.execute(customerId)
            res.status(200).json({success: true , msg:`Customer details successfully removed from database`})
        }catch (error){
            res.status(400).json({success: false , data: error})
        }
    }

}

export default CustomerController