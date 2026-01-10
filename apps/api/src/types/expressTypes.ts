import { NextFunction, Request, Response } from "express"

export type expressType = {
  err?: Error,
  next?: NextFunction,
  req: Request,
  res: Response
}
