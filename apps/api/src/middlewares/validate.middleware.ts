import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";


export const validateAdmin = asyncHandler(async(req, res , next) => {
 
  const user = (req as any).user;

  if(user.admin_role !== "owner") throw new ApiError(403, "don't have the authority to perform this operation"); 

  (req as any).user = user;
  next();
  
})
