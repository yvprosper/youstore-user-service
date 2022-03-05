 import express from "express";
 import { makeInvoker } from "awilix-express";
 import CustomerController from "../../controllers/customerController"
 import upload from "../../../../infra/libs/fileUploader";
 import { verifyCustomer } from "../../middlewares/verifyCustomerToken";


 const api = makeInvoker(CustomerController);
 const router = express.Router();

 router
      .route("/")
      .post(api('create'))
      .get(api('getAll')) //admin route
      .put(verifyCustomer, api('update'))
      .delete(verifyCustomer, api('delete'))
      
 router.post('/upload', verifyCustomer, upload.single('avatar'), api('upload'))
 router.get("/one",verifyCustomer, api('get')) 
 



  export default router;

