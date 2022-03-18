import express from "express";
import { makeInvoker } from "awilix-express";
import Auth from "../../controllers/authController";


const api = makeInvoker(Auth);
const router = express.Router();

router.post('/', api('authenticate'))



export default router;