import mongoose from "mongoose";
import Dean from "../models/Dean.schema.js";
import { nanoid } from "nanoid";
import Session from "../models/session.schema.js";

const login = async (req, res) => {
  try {
    const { universityId, password } = req.body;
    if (!universityId || !password) {
      return res.status(400).json({ error: "Enter all required Fields" });
    }

    const dean = await Dean.findOneAndUpdate(
      {
        universityID: universityId,
        password,
      },
      {
        uniqueId: nanoid(),
      },
      { upsert: true, new: true }
    );
    res.status(200).json(dean.uniqueId);
  } catch (e) {
    res.status(400).json("Something went wrong");
  }
};

export const availableSlots = async (req, res) => {
  console.log(req.user);
  const slots = await getAvailableDeanSlots(req.user._id);
  res.status(200).json(slots);
};

async function getAvailableDeanSlots(deanId) {
  const today = new Date();
  const nextTwoMonths = new Date(today);
  nextTwoMonths.setMonth(today.getMonth() + 2);

  const bookedSessions = await Session.find({
    dean: deanId,
    startDateTime: { $gte: today, $lt: nextTwoMonths },
  });

  const availableSlots = [];
  const currentDate = new Date(today);

  while (currentDate < nextTwoMonths) {
    const currentDayOfWeek = currentDate.getDay();

    if (currentDayOfWeek === 4 || currentDayOfWeek === 5) {
      // Thursday or Friday
      const slot = new Date(currentDate);
      slot.setHours(10, 0, 0, 0);

      const isBooked = bookedSessions.some((session) => {
        const sessionStartTime = session.startDateTime.getTime();
        const sessionEndTime = new Date(
          sessionStartTime + 60 * 60 * 1000
        ).getTime(); // Assuming each session is 1 hour long
        return (
          slot.getTime() >= sessionStartTime && slot.getTime() < sessionEndTime
        );
      });

      if (!isBooked) {
        availableSlots.push(slot);
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return availableSlots;
}

const getPendingSessions = async (req, res) => {
  const deanId = req.user._id;
  const sessions = await Session.find({ dean: deanId, completed: false });
  res.status(200).json(sessions);
};
export default { login, availableSlots, getPendingSessions };
