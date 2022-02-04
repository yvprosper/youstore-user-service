import mongoose from "mongoose";


export interface MerchantInput {
  fullName: string;
  businessName: string;
  phoneNo: string;
  avatar: string;
  address: string;
  myTransactions: mongoose.Schema.Types.ObjectId
  email: string;
  password: string;

}

export interface MerchantDocument extends MerchantInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const merchantSchema = new mongoose.Schema(
  {
   fullName: { 
       type: String,
       required: true
    },
    businessName: { 
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
    myTransactions: {
        type: mongoose.Schema.Types.ObjectId
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

const MerchantModel = mongoose.model<MerchantDocument>("Merchant", merchantSchema);

export default MerchantModel;