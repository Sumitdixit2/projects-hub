import { Router } from "express";
import { verifyJWT } from "../../middlewares/verifyJwt";
import { requireAdmin } from "../../middlewares/validateUser.middleware";
import { createMilestones } from "../../controllers/milestone/milestone.controller";
import { changeStatus } from "../../controllers/project/project.controller";

const milestoneRouter = Router();

milestoneRouter.route('/createMilestone/:id').post(verifyJWT,requireAdmin , createMilestones);
milestoneRouter.route('/changeMilestoneStatus/:id').patch(verifyJWT,requireAdmin,changeStatus);

export default milestoneRouter;
