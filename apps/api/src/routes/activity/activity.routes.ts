import { Router } from "express";
import { verifyJWT } from "../../middlewares/verifyJwt";
import { isMyId } from "../../middlewares/isMyId.middleware";
import { getMyActivity } from "../../controllers/activity/activity.controller";

const activityRouter = Router();

activityRouter.route('/getActivity').get(verifyJWT,isMyId,getMyActivity);

export default activityRouter;
