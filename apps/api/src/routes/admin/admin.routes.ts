import { Router } from "express";
import { createAdminKey, signUp, createClientKey, adminLogin, getClients, getAdmins, deleteClient, getClient, logoutAdmin, getStats } from "../../controllers/admin/admin.controller";
import { verifyJWT } from "../../middlewares/verifyJwt";
import { requireAdmin } from "../../middlewares/validateUser.middleware";
import { validateAdmin } from "../../middlewares/validate.middleware";
import { isMyId } from "../../middlewares/isMyId.middleware";
import { validateStaff } from "../../middlewares/validateStaff.middleware";
import { loginIpLimiter, signupIpLimiter } from "../../middlewares/ipRateLimiter.middleware";
import { readApiRateLimiter, sensitiveApiRateLimiter } from "../../middlewares/tokenBucketRateLimit.middleware";

const adminRouter = Router();

adminRouter.route('/signup').post(signupIpLimiter,signUp);
adminRouter.route('/login').post(loginIpLimiter,adminLogin);
adminRouter.route('/generateAdminKey').post(verifyJWT, requireAdmin, validateAdmin,sensitiveApiRateLimiter, createAdminKey);
adminRouter.route('/generateClientKey').post(verifyJWT, requireAdmin,validateStaff,sensitiveApiRateLimiter, createClientKey);
adminRouter.route('/getAllClients').get(verifyJWT, requireAdmin, validateStaff,readApiRateLimiter, getClients);
adminRouter.route('/getClient/:clientId').get(verifyJWT, requireAdmin, validateStaff,readApiRateLimiter, getClient);
adminRouter.route('/getAllAdmins').get(verifyJWT, requireAdmin, validateStaff,readApiRateLimiter, getAdmins);
adminRouter.route('/deleteClient/:id').delete(verifyJWT, requireAdmin, validateAdmin,sensitiveApiRateLimiter, deleteClient);
adminRouter.route('/logout/:id').post(verifyJWT,isMyId,sensitiveApiRateLimiter,logoutAdmin);
adminRouter.route('/getStats').get(verifyJWT,requireAdmin,readApiRateLimiter,validateStaff,getStats);

export default adminRouter;
