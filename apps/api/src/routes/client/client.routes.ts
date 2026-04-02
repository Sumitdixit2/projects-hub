import { Router } from "express";
import { clientLogin, clientSignUp, logoutClient } from "../../controllers/client/client.controller";
import { verifyJWT } from "../../middlewares/verifyJwt";
import { isMyId } from "../../middlewares/isMyId.middleware";

const clientRouter = Router();

clientRouter.route('/signup').post(clientSignUp);
clientRouter.route('/login').post(clientLogin);
clientRouter.route('/logout/:id').post(verifyJWT,isMyId,logoutClient);

export default clientRouter;
