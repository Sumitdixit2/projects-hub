import express, { Request, Response } from "express";
import cors from "cors";
import { Pool } from 'pg';
const app = express();

app.use(cors())
app.use(express.json())


const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

console.log("let's see if this console works or not");

app.listen(5000, () => {
  console.log("app is listening at port 5000 and updates are being showed");
})



app.get("/", (_req, res) => {
  res.send("Server is running!");
})

app.get("/check", async (_req: Request, res: Response) => {
  try {
    return res.json({
      success: true,
      message: "Working!"
    })
  } catch (error: any) {
    console.error("error while checking: ", error.message)
    res.json({
      success: false,
      error: error.message
    })
  }

})

app.post("/create-user", async (req: Request, res: Response) => {
  try {
    const { description } = req.body;
    console.log("RUNNING INSERT WITH RETURNING");
    const create_user = await pool.query('INSERT INTO test (description) VALUES ($1) RETURNING *', [description]);
    return res.status(201).json({
      success: true,
      message: create_user.rows[0]
    });
  } catch (error: any) {
    console.error("there is an error: ", error.message);
    res.json({
      success: false,
      error: error.message
    })
  }
})


