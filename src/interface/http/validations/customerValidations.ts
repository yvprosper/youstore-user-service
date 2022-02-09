import Joi from "joi";


//const Joi = BaseJoi;

// validation for creating a customer
export const createCustomerSchema = (user: string) => {
    const schema = Joi.object({
  fullName: Joi.string().required(),
  address: Joi.string().required(),
  phoneNo: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).unknown();
        return schema.validate(user);
}
