import { Router } from "express";
import { getAgencies, registerAgency, renewCode, resetPassword, verifyCode } from "../../controllers/agency/agency.controller";
import { otpIpLimiter, resetPassIpLimiter, signupIpLimiter } from "../../middlewares/ipRateLimiter.middleware";

const agencyRouter = Router();

agencyRouter.route('/registerAgency').post(signupIpLimiter,registerAgency);
agencyRouter.route('/get-agency').get(getAgencies);
agencyRouter.route('/verify-code').post(otpIpLimiter,verifyCode);
agencyRouter.route('/renew-code').post(renewCode);
agencyRouter.route('/reset-password').post(resetPassIpLimiter,resetPassword)

export default agencyRouter;
