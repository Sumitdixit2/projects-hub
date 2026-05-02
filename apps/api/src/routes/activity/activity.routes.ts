import { Router } from "express";
import { verifyJWT } from "../../middlewares/verifyJwt";
import { isMyId } from "../../middlewares/isMyId.middleware";
import { getAdminActivity, getMyActivity } from "../../controllers/activity/activity.controller";
import { requireAdmin } from "../../middlewares/validateUser.middleware";
import { validateAdmin } from "../../middlewares/validate.middleware";

const activityRouter = Router();

activityRouter.route('/getActivity/me').get(verifyJWT,isMyId,getMyActivity);
activityRouter.route('/getActivity/:id').get(verifyJWT,requireAdmin,validateAdmin,getAdminActivity);

export default activityRouter;
