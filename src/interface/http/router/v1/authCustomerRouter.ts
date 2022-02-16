import express from "express";
import { makeInvoker } from "awilix-express";
import CustomerAuth from "../../controllers/authControllerCustomers";
import { verifyCustomer } from "../../middlewares/verifyCustomerToken";

const api = makeInvoker(CustomerAuth);
const router = express.Router();

router
     .route("/customer")
     .post(api('authenticate'))
     


 router
     .route("/changepassword")
     .put(verifyCustomer, api('changePassword'))




 export default router;

