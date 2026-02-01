import { Router } from "express";
import { createAdminKey, loginAdmin , createClientKey } from "../../controllers/admin/admin.controller";
import { verifyJWT } from "../../middlewares/verifyJwt";

const adminRouter = Router();

adminRouter.route('/login').post(loginAdmin);
adminRouter.route('/generateAdminKey').post(verifyJWT, createAdminKey);
adminRouter.route('/generateClientKey').post(verifyJWT,createAdminKey);

export default adminRouter;
