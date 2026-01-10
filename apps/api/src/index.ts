import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';
import app from "./app";

dotenv.config()

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("There seems to be an error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

const Listen = async () => {
  try {
    app.listen(process.env.PORT || 5000, () => {
      console.log("App listening on Port : ", process.env.PORT);
    })
  } catch (error) {
    console.error("Error at calling the DB function: ", error);
  }
}


Listen();
