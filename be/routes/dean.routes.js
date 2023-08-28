import { Router } from "express";
import deanController from "../controllers/dean.controller.js";
import { auth } from "../middlewares/auth.js";

const deanRoutes = Router();

deanRoutes.post("/login", deanController.login);
deanRoutes.get("/slots/available", auth("dean"), deanController.availableSlots);
deanRoutes.get(
  "/sessions/pending",
  auth("dean"),
  deanController.getPendingSessions
);
export default deanRoutes;
