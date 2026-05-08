import { Router } from "express";
import { clientLogin, clientSignUp, logoutClient } from "../../controllers/client/client.controller";
import { verifyJWT } from "../../middlewares/verifyJwt";
import { isMyId } from "../../middlewares/isMyId.middleware";
import { loginIpLimiter, signupIpLimiter } from "../../middlewares/ipRateLimiter.middleware";
import { sensitiveApiRateLimiter } from "../../middlewares/tokenBucketRateLimit.middleware";

const clientRouter = Router();

clientRouter.route('/signup').post(signupIpLimiter,clientSignUp);
clientRouter.route('/login').post(loginIpLimiter,clientLogin);
clientRouter.route('/logout/:id').post(verifyJWT,isMyId,sensitiveApiRateLimiter,logoutClient);

export default clientRouter;
