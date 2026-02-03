import { Router } from "express";
import { createAdminKey, signUp, createClientKey } from "../../controllers/admin/admin.controller";
import { verifyJWT } from "../../middlewares/verifyJwt";

const adminRouter = Router();

adminRouter.route('/signup').post(signUp);
adminRouter.route('/generateAdminKey').post(verifyJWT, createAdminKey);
adminRouter.route('/generateClientKey').post(verifyJWT, createClientKey);

export default adminRouter;
