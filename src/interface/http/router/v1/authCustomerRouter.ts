import express from "express";
import { makeInvoker } from "awilix-express";
import CustomerAuth from "../../controllers/authControllerCustomers";
import { verifyCustomer } from "../../middlewares/verifyCustomerToken";


const api = makeInvoker(CustomerAuth);
const router = express.Router();

router.post("/",api('authenticate'))
     
router.put("/change-password" , verifyCustomer, api('changePassword'))
   
router.post('/reset-password' , api('reset'))

router.post('/reset-password/:id/:token', api('verify'))

router.get('/reset-password/:id/:token', api('redirect'))

router.get('/confirmation/:id/:token', api('verifyEmail'))


 export default router;

