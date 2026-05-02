import { Router } from "express";
import { verifyJWT } from "../../middlewares/verifyJwt";
import { isMyId } from "../../middlewares/isMyId.middleware";
import {  getAgencyActivity, getMyActivity } from "../../controllers/activity/activity.controller";
import { requireAdmin } from "../../middlewares/validateUser.middleware";
import { validateAdmin } from "../../middlewares/validate.middleware";

const activityRouter = Router();

activityRouter.route('/getActivity/me').get(verifyJWT,isMyId,getMyActivity);
activityRouter.route('/getAgencyActivity').get(verifyJWT,requireAdmin,validateAdmin,getAgencyActivity);

export default activityRouter;
