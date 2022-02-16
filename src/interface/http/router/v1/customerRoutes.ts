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
      


 router
      .route("/")
      .post(verifyCustomer, upload.single('avatar'), api('upload'))
      .put(verifyCustomer, api('update'))
      .delete(verifyCustomer, api('delete'))

 router.get("/:customerId",api('get')) //admin route



  export default router;

