import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";


export const validateStaff = asyncHandler(async(req,res,next) => {

  const user = (req as any).user;
  const userType = (req as any).userType;
   
  if(user.admin_role === "dev") throw new ApiError(403, "don't have the authority to do this operation");

  (req as any).user = user;
  (req as any).userType = userType;
  next();
})
