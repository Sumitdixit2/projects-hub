import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import agencyRouter from "./routes/agency/agency.routes";
import adminRouter from "./routes/admin/admin.routes";

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

app.use('/api/v1/agency', agencyRouter)
app.use('/api/v1/admin', adminRouter)

export default app;
