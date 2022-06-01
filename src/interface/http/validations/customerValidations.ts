import Joi from "joi";
import { CustomerDocument } from "../../../infra/database/models/mongoose/customerModel";

export interface Iauth {
  email: string;
  password: string;
}

export interface IchangePassword {
  oldPassword: string;
  newPassword: string;
}

export interface IresetPassword {
  confirmPassword: string;
  newPassword: string;
}

export interface Iquery {
  page: number;
  limit: number;
}


// validation for creating a customer
export const createCustomerSchema = (user: CustomerDocument) => {
  const schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  address: Joi.string().required(),
  phoneNo: Joi.string().length(11).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).unknown();
        return schema.validate(user);
}

// validation for updating a customer record
export const updateCustomerSchema = (user: CustomerDocument) => {
  const schema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  address: Joi.string(),
  phoneNo: Joi.string(),
}).unknown();
        return schema.validate(user);
}

export const signInValidation = (user: Iauth) => {
  const schema = Joi.object({
      email: Joi.string().required().email() ,
      password: Joi.string().required() 
  }).unknown();
      return schema.validate(user);
  }



export  const changePasswordValidation = (user: IchangePassword) => {
    const schema = Joi.object({
        newPassword: Joi.string().min(6).required() ,
        oldPassword: Joi.string().min(6).required() 
    }).unknown();
        return schema.validate(user);
    }

export const resetPasswordValidation = (user: IresetPassword) => {
      const schema = Joi.object({
          newPassword: Joi.string().min(6).required() ,
          confirmPassword: Joi.string().min(6).required() 
      }).unknown();
          return schema.validate(user);
      }
  

