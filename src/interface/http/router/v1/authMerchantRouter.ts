import express from "express";
import { makeInvoker } from "awilix-express";
import MerchantAuth from "../../controllers/authControllerMerchant";
import { verifyMerchant } from "../../middlewares/verifyMerchantToken";

const api = makeInvoker(MerchantAuth);
const router = express.Router();

router.post('/', api('authenticate'))
     
router.put("/change-password",verifyMerchant ,api('changePassword'))

router.post('/reset-password' , api('reset'))

router.post('/reset-password/:id/:token', api('verify'))

router.post('/confirmation/:id/:token', api('verifyEmail'))


 export default router;

