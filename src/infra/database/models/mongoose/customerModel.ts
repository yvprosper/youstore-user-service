import mongoose from "mongoose";


export interface CustomerInput {
  fullName: string;
  phoneNo: string;
  avatar: string;
  address: string;
  email: string;
  password: string;

}

export interface CustomerDocument extends CustomerInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new mongoose.Schema(
  {
   fullName: { 
       type: String,
       required: true
    },
    phoneNo: { 
        type: String, 
        required: true 
    },
    avatar: { 
        type: String
    },
    address: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
  },
  {
    timestamps: true,
  }
);

const CustomerModel = mongoose.model<CustomerDocument>("Customer", customerSchema);

export default CustomerModel;