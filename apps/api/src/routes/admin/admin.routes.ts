import { Router } from "express";
import { loginAdmin } from "../../controllers/admin/admin.controller";

const adminRouter = Router();

adminRouter.route('/login').post(loginAdmin);

export default adminRouter;
