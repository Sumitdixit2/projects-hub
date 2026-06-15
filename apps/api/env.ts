import "./env"
import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "test"
    ? ".env.test"
    : ".env",
});

console.log("using env",process.env.DATABASE_URL);

