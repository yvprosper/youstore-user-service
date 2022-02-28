import bcrypt from "bcrypt"
import NotFoundError from "../../interface/http/errors/notFound"
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
                let {fullName, storeName, phoneNo, address, avatar, email , password} = payload
                const hashedPassword= await bcrypt.hash(password , 12)
                password = hashedPassword
                const merchant = await this.merchantModel.create({fullName, storeName,  phoneNo, address, avatar, email , password});
                const saveMerchant = await merchant.save()
                
                // creating an email verification token
                const secret = this.config.get('merchantEmailSecret') 
                const token = jwt.sign({email: saveMerchant.email}, `${secret}`, {expiresIn: '1d'})
                  
                // creating an email verification link
                const link = `http://localhost:5000/v1/auth/merchant/confirmation/${saveMerchant._id}/${token}`
                

                console.log(link)

                //send to Queue
                this.messenger.sendToQueue(`verify_merchant_email`, {link, saveMerchant})


                return saveMerchant
            } catch (error) {
                this.logger.error(error);
            }
    }

    async get (merchantId: String) {
            try {
                const merchant = await this.merchantModel.findById(merchantId, {password: 0})
                return merchant
            } catch (error) {
                this.logger.error(error);
                
            }
    }


    async getAll (payload: Object) {
        try {
            const merchants = await this.merchantModel.find(payload, {password: 0})
            return merchants
        } catch (error) {
            this.logger.error(error);
            
        }
    }


    async update (merchantId: String, payload: MerchantDocument) {
        try {
            const merchant = await this.merchantModel.findOneAndUpdate({_id: merchantId}, payload, {
                new: true
            } )
            return merchant
        } catch (error) {
            this.logger.error(error);
        }
    }


    async delete (merchantId: String) {
            try {
                const merchant = await this.merchantModel.findOneAndDelete({_id: merchantId})
                if(!merchant) {
                    throw new NotFoundError('Merchant with this ID does not exist' , 404, `error`)
                }
                return merchant
            } catch (error) {
                this.logger.error(error);
                
            }
    }
}

export default MerchantRepository