import { Router } from "express";
import { createProject } from "../../controllers/project/project.controller";

const projectRouter = Router();

projectRouter.route('/createProject').post(createProject);

export default projectRouter;
