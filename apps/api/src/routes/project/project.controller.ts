import { Router } from "express";
import { changeStatus, createProject, getAllProject } from "../../controllers/project/project.controller";
import { verifyJWT } from "../../middlewares/verifyJwt";
import { requireAdmin } from "../../middlewares/validateUser.middleware";
import { validateAdmin } from "../../middlewares/validate.middleware";

const projectRouter = Router();

projectRouter.route('/createProject').post(verifyJWT, requireAdmin, createProject);
projectRouter.route('/getAllProjects').post(verifyJWT, requireAdmin, validateAdmin, getAllProject);
projectRouter.route('/changeStatus/:id').patch(verifyJWT, requireAdmin, validateAdmin, changeStatus);

export default projectRouter;
