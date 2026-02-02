import { Router } from "express";
import { clientSignUp } from "../../controllers/client/client.controller";

const clientRouter = Router();

clientRouter.route('/signup').post(clientSignUp);

export default clientRouter;
