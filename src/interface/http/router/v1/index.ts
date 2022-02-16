import express from "express";
// import other routes

import customerRoutes from "./customerRoutes"
import merchantRoutes from "./merchantRoutes"
import authRouter from "./authCustomerRouter"
import merchantAuth from "./authMerchantRouter"

const router = express.Router();


// mount routes
router.use("/customers" , customerRoutes)

router.use("/merchants" , merchantRoutes)

router.use("/auth", authRouter)

router.use("/auth/merchant", merchantAuth)




export default router;
