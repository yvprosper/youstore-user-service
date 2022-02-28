import mongoose from "mongoose";


export interface MerchantInput {
  storeName: string;
  phoneNo: string;
  avatar: string;
  storeBanner: string
  address: string;
  myTransactions: mongoose.Schema.Types.ObjectId
  email: string;
  bankName: string;
  accountNo: string;
  accountName: string
  isVerified: boolean
  password: string;

}

export interface MerchantDocument extends MerchantInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const merchantSchema = new mongoose.Schema(
  {
    storeName: { 
        type: String,
        required: true
     },
     bankName: { 
      type: String,
      required: true
   },
   accountNo: { 
    type: String,
    required: true
  },
   accountName: { 
    type: String,
    required: true
  },
    phoneNo: { 
        type: String, 
        required: true,
    },
    avatar: { 
        type: String
    },
    storeBanner: { 
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
    isVerified: { 
      type: Boolean, 
      default: false 
    },
    password: { 
        type: String, 
        required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MerchantModel = mongoose.model<MerchantDocument>("Merchant", merchantSchema);

export default MerchantModel;