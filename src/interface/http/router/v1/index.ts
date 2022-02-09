import express from "express";
// import other routes

import customerRoutes from "./customerRoutes"
import merchantRoutes from "./merchantRoutes"

const router = express.Router();


// mount routes
router.use("/customers" , customerRoutes)

router.use("/merchants" , merchantRoutes)


export default router;
