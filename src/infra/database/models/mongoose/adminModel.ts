import mongoose from "mongoose";


export interface AdminInput {
  firstName: string;
  lastName: string;
  phoneNo: string;
  avatar: string;
  email: string;
  password: string;
  hasCompletedSignUp: boolean;
  isRestricted: boolean;
  role: string;
  permissions: string[];

}

export interface AdminDocument extends AdminInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new mongoose.Schema(
  {
   firstName: { 
       type: String,
       trim: true
    },
    lastName: { 
      type: String,
      trim: true
   },
    phoneNo: { 
        type: String, 
        trim: true,
    },
    avatar: { 
        type: String
    },
    email: { 
        type: String, 
        required: true,
        trim: true,
        immutable: true
    },
    password: { 
        type: String, 
        trim: true,
    },
    hasCompletedSignUp: { 
      type: Boolean, 
      default: false 
    },
    isRestricted: { 
      type: Boolean, 
      default: false 
    },
    role: { 
        type: String, 
        enum: ['superAdmin', 'manager', 'admin'], 
        required: true
    },
    permissions: [
        {
            type: String
        }
    ]
  },
  {
    timestamps: true,
  }
);
//mongoose.models = {}
const AdminModel = mongoose.model<AdminDocument>("Admin", adminSchema);
//mongoose.models = {}
export default AdminModel;