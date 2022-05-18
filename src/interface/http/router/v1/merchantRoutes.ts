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
     .put(verifyMerchant, api('update'))
     .delete(verifyMerchant, api('delete'))

     
 router.get("/one",verifyMerchant, api('get') )
 router.get("/one/:merchantId", api('getOne') ) 
 router.post('/upload',verifyMerchant, upload.single('avatar'), api('upload') )
 router.post('/upload-banner',verifyMerchant, upload.single('banner'), api('uploadStoreBanner') )

 export default router;

