import { Router } from "express";
import {refreshAccessToken} from "../../controllers/token/token.controller"

const tokenRouter = Router();

tokenRouter.route('/refreshAccessToken').post(refreshAccessToken);

export default tokenRouter;
