import express, { Request, Response } from "express";
import cors from "cors";
import { Pool } from 'pg';
const app = express();

app.use(cors())
app.use(express.json())


const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'test',
  user: 'postgres',
  password: '',
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
    const create_user = await pool.query("INSERT INTO test (description) VALUES ($1)", [description]);
    res.json(create_user);
  } catch (error: any) {
    console.error("there is an error: ", error.message);
    res.json({
      sucess: false,
      error: error.message
    })
  }
})

app.listen(5000, () => {
  console.log("app is listening at port 5000");
})


