import { Router } from "express";
import { createAdminKey, loginAdmin } from "../../controllers/admin/admin.controller";

const adminRouter = Router();

adminRouter.route('/login').post(loginAdmin);
adminRouter.route('/generateAdminKey').post(createAdminKey);


export default adminRouter;
