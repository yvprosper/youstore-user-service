import Joi from "joi";


//const Joi = BaseJoi;

// validation for creating a merchant
export const createMerchantSchema = (user: string) => {
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
