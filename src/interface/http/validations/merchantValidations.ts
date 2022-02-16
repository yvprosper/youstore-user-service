import Joi from "joi";
import { MerchantDocument } from "../../../infra/database/models/mongoose/merchantModel";


//const Joi = BaseJoi;

// validation for creating a merchant
export const createMerchantSchema = (user: MerchantDocument) => {
    const schema = Joi.object({
  fullName: Joi.string().required(),
  storeName: Joi.string().required(),
  address: Joi.string().required(),
  phoneNo: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).unknown();
        return schema.validate(user);
}
