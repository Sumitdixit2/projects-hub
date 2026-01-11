import { Router } from "express";
import { getAgencies, registerAgency } from "../../controllers/agency/agency.controller";

const agencyRouter = Router();

agencyRouter.route('/registerAgency').post(registerAgency);
agencyRouter.route('/get-agency').get(getAgencies);

export default agencyRouter;
