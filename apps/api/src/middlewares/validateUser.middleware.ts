import { userType } from "../controllers/admin/admin.controller";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";


export const requireAdmin = asyncHandler(async(req, res , next) => {

 const user = (req as any).user;
 const userType = (req as any).userType;

 if(userType === "client") throw new ApiError(403 , "don't have the authority to perform this operation");

 (req as any).user = user;
 (req as any).userType = userType;
  next();

}); 

