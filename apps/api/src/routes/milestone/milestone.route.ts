import { Router } from "express";
import { verifyJWT } from "../../middlewares/verifyJwt";
import { requireAdmin } from "../../middlewares/validateUser.middleware";
import { createMilestones } from "../../controllers/milestone/milestone.controller";

const milestoneRouter = Router();

milestoneRouter.route('/createMilestone/:id').post(verifyJWT,requireAdmin , createMilestones);
