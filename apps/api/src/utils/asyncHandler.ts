import { Request, Response, NextFunction } from "express"

type AsyncHandlerFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

const asyncHandler = (fn: AsyncHandlerFn
) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await fn(req, res, next);
    return response;
  } catch (error) {
    console.log("this error: ", error);
    next(error);
  }
};

export default asyncHandler;
