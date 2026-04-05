import { Router } from "express";
import { verifyJWT } from "../../middlewares/verifyJwt";
import { requireAdmin } from "../../middlewares/validateUser.middleware";
import { createMilestones, deleteMilestone, getMilestone, getMyMilestone } from "../../controllers/milestone/milestone.controller";
import { changeStatus } from "../../controllers/project/project.controller";
import { validateStaff } from "../../middlewares/validateStaff.route";

const milestoneRouter = Router();

milestoneRouter.route('/createMilestone/:id').post(verifyJWT, requireAdmin, createMilestones);
milestoneRouter.route('/changeMilestoneStatus/:id').patch(verifyJWT, requireAdmin, changeStatus);
milestoneRouter.route('/getMilestones/:id').get(verifyJWT, requireAdmin, getMyMilestone);
milestoneRouter.route('/deleteMilestone/:id').post(verifyJWT,requireAdmin,validateStaff,deleteMilestone);
milestoneRouter.route('/getMilestone/:id').get(verifyJWT,requireAdmin,getMilestone);

export default milestoneRouter;
