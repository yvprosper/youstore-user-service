 import express from "express";
 import { makeInvoker } from "awilix-express";
 import CustomerController from "../../controllers/customerController"

 const api = makeInvoker(CustomerController);
 const router = express.Router();

 router
      .route("/create")
      .post(api('create'))


  router
      .route("/:customerId")
      .get(api('get'))

  router
      .route("/update/:customerId")
      .put(api('update'))

  router
      .route("/delete/:customerId")
      .delete(api('delete'))

  router
      .route("/all")
      .get(api('getAll'))


  export default router;

