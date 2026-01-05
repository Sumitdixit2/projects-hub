import express from "express";
import cors from "cors"


const app = express();

app.use(cors())
app.use(express.json())

app.get("/health", (_req, res) => {
  res.json({ ok: true })
})

app.listen(4000, () => {
  console.log("app is listening at port 4000");
})
