import express from "express";
import { makeInvoker } from "awilix-express";
import Auth from "../../controllers/authController";
import { verifyUser } from "../../middlewares/verifyUser";


const api = makeInvoker(Auth);
const router = express.Router();

router.post('/', api('authenticate'))
router.get('/user', verifyUser, api('fetch'))



export default router;