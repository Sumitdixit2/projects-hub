import { Router } from "express";
import { createAdminKey, loginAdmin } from "../../controllers/admin/admin.controller";
import { verifyJWT } from "../../middlewares/verifyJwt";

const adminRouter = Router();

adminRouter.route('/login').post(loginAdmin);
adminRouter.route('/generateAdminKey').post(verifyJWT, createAdminKey);


export default adminRouter;
