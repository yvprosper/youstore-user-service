import express from "express";
import { makeInvoker } from "awilix-express";
import MerchantAuth from "../../controllers/authControllerMerchant";
import { verifyMerchant } from "../../middlewares/verifyMerchantToken";

const api = makeInvoker(MerchantAuth);
const router = express.Router();

router
     .route("/")
     .post(api('authenticate'))
     


 router
     .route("/changepassword")
     .put(verifyMerchant ,api('changePassword'))



 export default router;

