import { Router } from "express";
import { createAdminKey, signUp, createClientKey, adminLogin, getClients } from "../../controllers/admin/admin.controller";
import { verifyJWT } from "../../middlewares/verifyJwt";
import { requireAdmin } from "../../middlewares/validateUser.middleware";
import { validateAdmin } from "../../middlewares/validate.middleware";

const adminRouter = Router();

adminRouter.route('/signup').post(signUp);
adminRouter.route('/login').post(adminLogin);
adminRouter.route('/generateAdminKey').post(verifyJWT, requireAdmin, validateAdmin, createAdminKey);
adminRouter.route('/generateClientKey').post(verifyJWT, requireAdmin, createClientKey);
adminRouter.route('/getAllClients').get(verifyJWT, requireAdmin, validateAdmin, getClients);

export default adminRouter;
