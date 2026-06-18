import { pool } from "../../postgress-config";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";

export const isMyMilestone = asyncHandler(async (req, res, next) => {

    const user = (req as any).user;
    const { id } = req.params;
    const userType = (req as any).userType;

    if (userType === "admin") {

        const getProject = await pool.query('SELECT project_id FROM milestone WHERE id = $1', [id]);
        if (!getProject.rowCount) throw new ApiError(404, "Milestone not found");

        const project_id = getProject.rows[0].project_id;
        const isAssigned = await pool.query('SELECT admin_id FROM project WHERE id = $1', [project_id]);

        if (!isAssigned) throw new ApiError(404, "project not found");

        const admin_id = isAssigned.rows[0].admin_id;

        if (admin_id !== user.id && user.admin_role !== "owner") throw new ApiError(403, "don't have the authority to access this project");
    }

    if (userType === "client") {
        const getProject = await pool.query('SELECT project_id FROM milestone WHERE id = $1', [id]);
        if (!getProject.rowCount) throw new ApiError(404, "Milestone not found");

        const project_id = getProject.rows[0].project_id;
        const isYour = await pool.query('SELECT client_id FROM project WHERE id = $1', [project_id]);

        if (!isYour) throw new ApiError(404, "project not found");

        const client_id = isYour.rows[0].client_id;

        if (client_id !== user.id) throw new ApiError(403, "don't have the access for this project");
    }

    (req as any).user = user;
    next();
})