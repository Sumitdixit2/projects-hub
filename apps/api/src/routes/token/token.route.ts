import { Router } from "express";
import {refreshAccessToken} from "../token/token.route"

const tokenRouter = Router();

tokenRouter.route('/refreshAccessToken').post(refreshAccessToken);

export default tokenRouter;
