import { Router } from "express";
import { getAgencies, registerAgency, renewCode, resetPassword, verifyCode } from "../../controllers/agency/agency.controller";

const agencyRouter = Router();

agencyRouter.route('/registerAgency').post(registerAgency);
agencyRouter.route('/get-agency').get(getAgencies);
agencyRouter.route('/verify-code').post(verifyCode);
agencyRouter.route('/renew-code').post(renewCode);
agencyRouter.route('/reset-password').post(resetPassword)

export default agencyRouter;
