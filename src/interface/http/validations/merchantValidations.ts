import Joi from "joi";
import { MerchantDocument } from "../../../infra/database/models/mongoose/merchantModel";


//const Joi = BaseJoi;

// validation for creating a merchant
export const createMerchantSchema = (user: MerchantDocument) => {
    const schema = Joi.object({
  storeName: Joi.string().required(),
  address: Joi.string().required(),
  phoneNo: Joi.string().length(11).required(),
  accountNo: Joi.string().length(10),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
}).unknown();
        return schema.validate(user);
}

// validation for updating a merchant record
export const updateMerchantSchema = (user: MerchantDocument) => {
  const schema = Joi.object({
storeName: Joi.string(),
address: Joi.string(),
phoneNo: Joi.string().length(11),
accountNo: Joi.string().length(10),
accountName: Joi.string(),
bankName: Joi.string()
}).unknown();
      return schema.validate(user);
}
