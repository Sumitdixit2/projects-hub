import { Router } from "express";
import { getAgencies, registerAgency, verifyCode } from "../../controllers/agency/agency.controller";

const agencyRouter = Router();

agencyRouter.route('/registerAgency').post(registerAgency);
agencyRouter.route('/get-agency').get(getAgencies);
agencyRouter.route('/verify-code').post(verifyCode);

export default agencyRouter;
