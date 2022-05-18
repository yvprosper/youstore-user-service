import bcrypt from "bcrypt"
import { MerchantDocument } from "../database/models/mongoose/merchantModel"
import MerchantModel from "../database/models/mongoose/merchantModel"
import log from "../../interface/http/utils/logger"
import Messenger from "../libs/rabbitmq"
import jwt from "jsonwebtoken"
import Config from "config"

 class MerchantRepository {
    merchantModel: typeof MerchantModel
    logger: typeof log
    messenger: Messenger
    config: typeof Config
    constructor({merchantModel , logger, messenger, config}: {merchantModel: typeof MerchantModel, logger: typeof log, messenger: Messenger, config: typeof Config}){
        this.merchantModel = merchantModel
        this.logger = logger
        this.messenger = messenger
        this.config = config
    }

    async create (payload: MerchantDocument) {
            try {
                let {bankName,accountName, accountNo, storeName, phoneNo, address, avatar, email , password} = payload
                const hashedPassword= await bcrypt.hash(password , 12)
                password = hashedPassword
                const merchant = await this.merchantModel.create({bankName,accountName, accountNo, storeName, phoneNo, address, avatar, email , password});
                const saveMerchant = await merchant.save()
                
                // creating an email verification token
                const secret = this.config.get('merchantEmailSecret') 
                const token = jwt.sign({email: saveMerchant.email}, `${secret}`, {expiresIn: '1d'})
                  
                // creating an email verification link
                const link = `https://youstore-users.herokuapp.com/v1/auth/merchant/confirmation/${saveMerchant._id}/${token}`
                

                //send to Queue
                this.messenger.sendToQueue(`verify_merchant_email`, {link, saveMerchant})

                return saveMerchant
            } catch (error) {
                throw error
            }
    }

    async get (merchantId: String) {
            try {
                const merchant = await this.merchantModel.findById(merchantId, {password: 0})
                if(!merchant) throw new Error('Merchant with this ID does not exist')
                return merchant
            } catch (error) {
                throw error
                
            }
    }


    async getAll (payload: Object) {
        try {
            const merchants = await this.merchantModel.find(payload, {password: 0})
            return merchants
        } catch (error) {
            throw error
            
        }
    }


    async update (merchantId: String, payload: MerchantDocument) {
        try {
            const merchant = await this.merchantModel.findOneAndUpdate({_id: merchantId}, payload, {
                new: true
            } )

            if(!merchant) throw new Error('Merchant with this ID does not exist')
            return merchant
        } catch (error) {
            throw error
        }
    }


    async delete (merchantId: String) {
            try {
                const merchant = await this.merchantModel.findOneAndDelete({_id: merchantId})
                if(!merchant) throw new Error('Merchant with this ID does not exist')
                

                //send to Queue
                this.messenger.sendToQueue(`merchant_deleted`, merchantId)
                return merchant
            } catch (error) {
                throw error
                
            }
    }
}

export default MerchantRepository