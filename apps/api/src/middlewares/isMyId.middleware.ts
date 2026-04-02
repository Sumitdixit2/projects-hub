import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";


export const isMyId = asyncHandler(async(req,res,next) => {
  
  const user = (req as any).user;
  console.log("user is bruh:",user);
  const {id} = req.params;

  if(user.id !== id) throw new ApiError(400, "do not have the access to do this operation");

  (req as any).user = user;
  next();

})
