import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import studentRoutes from "./routes/student.routes.js";
import deanRoutes from "./routes/dean.routes.js";
const PORT = 5000;
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then((data) => {
    console.log("connected to databse");
  })
  .catch((e) => {
    console.log(e);
    process.exit();
  });

const app = express();
app.use(express.json());

app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/dean", deanRoutes);

app.listen(PORT, () => {
  console.log("running on port 5000");
});
