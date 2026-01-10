import { Router } from "express";
import { get_age } from "../../controllers/agency/agency.controller";

const userRouter = Router();

userRouter.route('/get-agencies').get(get_age);

export default userRouter;
