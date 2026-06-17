import { Router } from "express";
import { changeStatus, createProject, deleteProject, getAllProject, getMyProject } from "../../controllers/project/project.controller";
import { verifyJWT } from "../../middlewares/verifyJwt";
import { requireAdmin } from "../../middlewares/validateUser.middleware";
import { validateAdmin } from "../../middlewares/validate.middleware";
import { isMyProject } from "../../middlewares/isMyProject.middleware";
import { validateStaff } from "../../middlewares/validateStaff.middleware";
import { readApiRateLimiter, sensitiveApiRateLimiter, writeApiRateLimiter } from "../../middlewares/tokenBucketRateLimit.middleware";


const projectRouter = Router();

projectRouter.route('/createproject').post(verifyJWT, requireAdmin, validateStaff, writeApiRateLimiter, createProject);
projectRouter.route('/getAllAgencyProjects').get(verifyJWT, requireAdmin, validateStaff, readApiRateLimiter, getAllProject);
projectRouter.route('/getAllOwnerProjects').get(verifyJWT,, readApiRateLimiter, getAllProject);
projectRouter.route('/changeStatus/:id').patch(verifyJWT, requireAdmin, isMyProject, writeApiRateLimiter, changeStatus);
projectRouter.route('/getMyProject/:id').get(verifyJWT, requireAdmin, isMyProject, readApiRateLimiter, getMyProject);
projectRouter.route('/deleteProject/:id').delete(verifyJWT, requireAdmin, validateAdmin, sensitiveApiRateLimiter, deleteProject);

export default projectRouter;
