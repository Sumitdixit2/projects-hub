import { Router } from "express";
import { registerAgency } from "../../controllers/agency/agency.controller";

const userRouter = Router();

userRouter.route('/registerAgency').post(registerAgency);

export default userRouter;
