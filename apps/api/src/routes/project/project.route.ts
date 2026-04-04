import { Router } from "express";
import { changeStatus, createProject, deleteProject, getAllProject, getMyProject } from "../../controllers/project/project.controller";
import { verifyJWT } from "../../middlewares/verifyJwt";
import { requireAdmin } from "../../middlewares/validateUser.middleware";
import { validateAdmin } from "../../middlewares/validate.middleware";
import { isMyProject } from "../../middlewares/isMyProject.middleware";
import { validateStaff } from "../../middlewares/validateStaff.route";

const projectRouter = Router();

projectRouter.route('/createproject').post(verifyJWT, requireAdmin, validateStaff, createProject);
projectRouter.route('/getAllProjects').get(verifyJWT, requireAdmin, validateStaff, getAllProject);
projectRouter.route('/changeStatus/:id').patch(verifyJWT, requireAdmin, isMyProject, changeStatus);
projectRouter.route('/getMyProject/:id').get(verifyJWT, requireAdmin, isMyProject, getMyProject);
projectRouter.route('/deleteProject/:id').delete(verifyJWT, requireAdmin, validateAdmin, deleteProject);

export default projectRouter;
