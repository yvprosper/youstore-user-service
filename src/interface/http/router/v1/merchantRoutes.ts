import express from "express";
import { makeInvoker } from "awilix-express";
import MerchantController from "../../controllers/merchantController";
import upload from "../../../../infra/libs/fileUploader";
import { verifyMerchant } from "../../middlewares/verifyMerchantToken";

const api = makeInvoker(MerchantController);
const router = express.Router();

router
     .route("/")
     .post(api('create'))
     .get(api('getAll')) //admin route to be protected 


 router
     .route("/")
     .post(verifyMerchant, upload.single('avatar'), api('upload'))
     .put(verifyMerchant, api('update'))
     .delete(verifyMerchant, api('delete'))

 router.get("/:merchantId", api('get') ) //admin route to be protected

 export default router;

