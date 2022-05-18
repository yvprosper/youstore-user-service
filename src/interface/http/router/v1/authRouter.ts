import express from "express";
import { makeInvoker } from "awilix-express";
import Auth from "../../controllers/authController";
import { verifyUser } from "../../middlewares/verifyUser";


const api = makeInvoker(Auth);
const router = express.Router();

router.post('/', api('authenticate'))
router.get('/user', verifyUser, api('fetch'))

router.put("/admin/change-password",verifyUser ,api('changePassword'))

router.post('/admin/reset-password' , api('reset'))

router.post('/admin/reset-password/:id/:token', api('verify'))

router.get('/admin/reset-password/:id/:token', api('redirect'))




export default router;