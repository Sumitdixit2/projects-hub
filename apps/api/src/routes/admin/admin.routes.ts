import { Router } from "express";
import { createAdminKey, signUp, createClientKey, adminLogin, getClients, getAdmins, deleteClient, getClient, logoutAdmin, getStats } from "../../controllers/admin/admin.controller";
import { verifyJWT } from "../../middlewares/verifyJwt";
import { requireAdmin } from "../../middlewares/validateUser.middleware";
import { validateAdmin } from "../../middlewares/validate.middleware";
import { isMyId } from "../../middlewares/isMyId.middleware";
import { validateStaff } from "../../middlewares/validateStaff.route";

const adminRouter = Router();

adminRouter.route('/signup').post(signUp);
adminRouter.route('/login').post(adminLogin);
adminRouter.route('/generateAdminKey').post(verifyJWT, requireAdmin, validateAdmin, createAdminKey);
adminRouter.route('/generateClientKey').post(verifyJWT, requireAdmin,validateStaff, createClientKey);
adminRouter.route('/getAllClients').get(verifyJWT, requireAdmin, validateStaff, getClients);
adminRouter.route('/getClient/:clientId').get(verifyJWT, requireAdmin, validateStaff, getClient);
adminRouter.route('/getAllAdmins').get(verifyJWT, requireAdmin, validateStaff, getAdmins);
adminRouter.route('/deleteClient/:id').delete(verifyJWT, requireAdmin, validateAdmin, deleteClient);
adminRouter.route('/logout/:id').post(verifyJWT,isMyId,logoutAdmin);
adminRouter.route('/getStats').get(verifyJWT,validateStaff,getStats);

export default adminRouter;
