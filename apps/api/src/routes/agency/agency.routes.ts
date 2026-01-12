import { Router } from "express";
import { getAgencies, registerAgency, renewCode, verifyCode } from "../../controllers/agency/agency.controller";

const agencyRouter = Router();

agencyRouter.route('/registerAgency').post(registerAgency);
agencyRouter.route('/get-agency').get(getAgencies);
agencyRouter.route('/verify-code').post(verifyCode);
agencyRouter.route('/renew-code').post(renewCode);

export default agencyRouter;
