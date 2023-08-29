import { Router } from "express";
import studentControllers from "../controllers/student.controller.js";
import { auth } from "../middlewares/auth.js";

const studentRoutes = Router();

studentRoutes.post("/login", studentControllers.login);
studentRoutes.post("/slot/book", auth("student"), studentControllers.bookSlot);
studentRoutes.get(
  "/slots/available/:deanId",
  auth("student"),
  studentControllers.getDeansAvailableSlotsById
);
studentRoutes.get("/deans", auth("student"), studentControllers.getAllDeans);
export default studentRoutes;
