import { Router } from "express";
import { clientLogin, clientSignUp } from "../../controllers/client/client.controller";

const clientRouter = Router();

clientRouter.route('/signup').post(clientSignUp);
clientRouter.route('/login').post(clientLogin);

export default clientRouter;
