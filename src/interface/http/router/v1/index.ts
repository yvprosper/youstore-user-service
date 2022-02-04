import express from "express";
// import other routes
//import dummyRouter from "./dummyRouter";

//import userRouter from "./userRouter"


import customerRoutes from "./customerRoutes"

const router = express.Router();

router.use("/customer" , customerRoutes)
// mount routes
//router.use("/dummy", dummyRouter);

//router.use("/user", userRouter)

export default router;
