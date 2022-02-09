import express from "express";
import { makeInvoker } from "awilix-express";
import MerchantController from "../../controllers/merchantController";
//  const validator = require("express-joi-validation").createValidator({
//     passError: true, // NOTE: this tells the module to pass the error along for you
// });

const api = makeInvoker(MerchantController);
const router = express.Router();

router
     .route("/")
     .post(api('create'))
     .get(api('getAll'))


 router
     .route("/:merchantId")
     .get(api('get'))
     .put(api('update'))
     .delete(api('delete'))



 export default router;

