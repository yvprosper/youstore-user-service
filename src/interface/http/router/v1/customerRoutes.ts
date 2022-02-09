 import express from "express";
 import { makeInvoker } from "awilix-express";
 import CustomerController from "../../controllers/customerController"
//  const validator = require("express-joi-validation").createValidator({
//     passError: true, // NOTE: this tells the module to pass the error along for you
// });

 const api = makeInvoker(CustomerController);
 const router = express.Router();

 router
      .route("/")
      .post(api('create'))
      .get(api('getAll'))


  router
      .route("/:customerId")
      .get(api('get'))
      .put(api('update'))
      .delete(api('delete'))



  export default router;

