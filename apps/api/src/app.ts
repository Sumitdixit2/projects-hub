import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import agencyRouter from "./routes/agency/agency.routes";
import adminRouter from "./routes/admin/admin.routes";
import tokenRouter from "./routes/token/token.route"
import clientRouter from "./routes/client/client.routes";
import projectRouter from "./routes/project/project.route";
import milestoneRouter from "./routes/milestone/milestone.route";
import ApiError from "./utils/apiError";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));
app.use(cookieParser());

app.use('/api/v1/agency', agencyRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/token', tokenRouter);
app.use('/api/v1/client', clientRouter);
app.use('/api/v1/project', projectRouter);
app.use('/api/v1/milestone', milestoneRouter);

app.use((err: any, req: any, res: any, next: any) => {
  console.error("GLOBAL ERROR:", err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

export default app;
