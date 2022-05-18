import express from "express";
import { makeInvoker } from "awilix-express";
import AdminController from "../../controllers/adminController";
import upload from "../../../../infra/libs/fileUploader";
import checkPermission from "../../middlewares/checkPermission";
import { verifyAdmin } from "../../middlewares/verifyAdminToken";


const api = makeInvoker(AdminController);
const router = express.Router();

router
      .route("/")
      .post(verifyAdmin, checkPermission('create-admin'),  api('create'))
      .get(verifyAdmin, checkPermission('view-users'),api('getAllUsers')) //get all users(admins, merchants, customers)
      .put(verifyAdmin, api('update')) //update admin account
      //.delete(verifyAdmin, api('delete')) //delete admin account

router.post('/complete', api('completeRegisteration'))
router.get('/user/one/:userId',verifyAdmin,checkPermission('view-users'), api('get')) //get one user(admins, merchants, customers)
router.get('/fetch/admins', verifyAdmin, checkPermission('view-admins'),api('getAllAdmins'))
router.post('/restrict/admin', verifyAdmin, checkPermission('sanction-admins'),api('sanctionAdmin'))
router.post('/restrict/merchant', verifyAdmin, checkPermission('sanction-users'),api('sanctionMerchant'))
router.post('/unban/merchant', verifyAdmin, checkPermission('sanction-users'),api('unRestrictMerchant'))
router.post('/unban/admin', verifyAdmin, checkPermission('sanction-users'),api('unRestrictAdmin'))
router.post('/upload', verifyAdmin, upload.single('avatar'), api('upload'))

export default router;