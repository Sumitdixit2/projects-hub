import { Router } from "express";
import { changeStatus, createProject, getAllProject, getMyProject } from "../../controllers/project/project.controller";
import { verifyJWT } from "../../middlewares/verifyJwt";
import { requireAdmin } from "../../middlewares/validateUser.middleware";
import { validateAdmin } from "../../middlewares/validate.middleware";
import { isMyProject } from "../../middlewares/isMyProject.middleware";

const projectRouter = Router();

projectRouter.route('/createProject').post(verifyJWT, requireAdmin,validateAdmin, createProject);
projectRouter.route('/getAllProjects').get(verifyJWT, requireAdmin, validateAdmin, getAllProject);
projectRouter.route('/changeStatus/:id').patch(verifyJWT, requireAdmin, isMyProject, changeStatus);
projectRouter.route('/getMyProject/:id').get(verifyJWT, requireAdmin , isMyProject , getMyProject);

export default projectRouter;
