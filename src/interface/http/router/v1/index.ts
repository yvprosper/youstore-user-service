import express from "express";
// import other routes

import customerRoutes from "./customerRoutes"
import merchantRoutes from "./merchantRoutes"
import authRouter from "./authCustomerRouter"
import merchantAuth from "./authMerchantRouter"
import auth from "./authRouter"

const router = express.Router();


// mount routes
router.use("/customers" , customerRoutes)

router.use("/merchants" , merchantRoutes)

router.use("/auth/", auth)

router.use("/auth/customer", authRouter)

router.use("/auth/merchant", merchantAuth)




export default router;
