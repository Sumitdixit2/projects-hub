import { Router } from "express";
import { verifyJWT } from "../../middlewares/verifyJwt";
import { requireAdmin } from "../../middlewares/validateUser.middleware";
import { changeMilestoneStatus, createMilestones, deleteMilestone, getMilestone, getMyMilestone } from "../../controllers/milestone/milestone.controller";
import { validateStaff } from "../../middlewares/validateStaff.middleware";
import { readApiRateLimiter,  sensitiveApiRateLimiter,  writeApiRateLimiter } from "../../middlewares/tokenBucketRateLimit.middleware";

const milestoneRouter = Router();

milestoneRouter.route('/createMilestone/:id').post(verifyJWT, requireAdmin,writeApiRateLimiter, createMilestones);
milestoneRouter.route('/changeMilestoneStatus/:id').patch(verifyJWT, requireAdmin,writeApiRateLimiter, changeMilestoneStatus);
milestoneRouter.route('/getMilestones/:id').get(verifyJWT, requireAdmin,readApiRateLimiter, getMyMilestone);
milestoneRouter.route('/deleteMilestone/:id').post(verifyJWT,requireAdmin,validateStaff,sensitiveApiRateLimiter,deleteMilestone);
milestoneRouter.route('/getMilestone/:id').get(verifyJWT,requireAdmin,readApiRateLimiter,getMilestone);

export default milestoneRouter;
