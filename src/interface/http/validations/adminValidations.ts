import Joi from "joi";
import { AdminDocument } from "../../../infra/database/models/mongoose/adminModel";


//const Joi = BaseJoi;

// validation for admin signUp
export const createAdminSchema = (user: AdminDocument) => {
    const schema = Joi.object({
  role: Joi.string().required(),
  email: Joi.string().email().required(),
}).unknown();
        return schema.validate(user);
}

// validation for updating an admin record
export const updateAdminSchema = (user: AdminDocument) => {
  const schema = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    phoneNo: Joi.string().length(11)
}).unknown();
      return schema.validate(user);
}

// validation for completing admin signup
export const completeSignUpSchema = (user: AdminDocument) => {
    const schema = Joi.object({
        firstName: Joi.string(),
        lastName: Joi.string(),
        phoneNo: Joi.string().length(11)
  }).unknown();
        return schema.validate(user);
  }
