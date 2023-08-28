import { Router } from "express";
import studentControllers from "../controllers/student.controller.js";
import { auth } from "../middlewares/auth.js";

const studentRoutes = Router();

studentRoutes.post("/login", studentControllers.login);
studentRoutes.post("/slot/book", auth("student"), studentControllers.bookSlot);
export default studentRoutes;
