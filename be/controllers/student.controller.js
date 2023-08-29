import mongoose from "mongoose";
import Student from "../models/student.model.js";
import { nanoid } from "nanoid";
import Session from "../models/session.schema.js";
import Dean from "../models/Dean.schema.js";

const login = async (req, res) => {
  try {
    const { universityId, password } = req.body;
    if (!universityId || !password) {
      return res.status(400).json({ error: "Enter all required Fields" });
    }

    const student = await Student.findOneAndUpdate(
      {
        universityID: universityId,
        password,
      },
      {
        uniqueId: nanoid(),
      },
      { upsert: true, new: true }
    );
    res.status(200).json(student.uniqueId);
  } catch (e) {
    res.status(400).json("Something went wrong");
  }
};
const bookSlot = async (req, res) => {
  const studentId = req.user._id;
  const { startDateTime, deanUniversityID } = req.body;
  const dean = await Dean.findOne({ universityID: deanUniversityID });
  const isSlotAvailable = await checkSlotAvailability(startDateTime, dean._id);
  if (!isSlotAvailable) {
    return res
      .status(400)
      .json({ error: "The requested slot is not available." });
  }
  const session = new Session({
    student: studentId,
    dean: dean._id,
    startDateTime: new Date(startDateTime),
  });
  const updated = await Dean.findByIdAndUpdate(
    dean._id,
    {
      $push: { sessions: session },
    },
    { new: true }
  );

  await session.save();
  res.status(200).json("slot booked successfully");
};

async function checkSlotAvailability(startDateTime, deanId) {
  // Check if the slot is already booked
  const dean = await Dean.findById(deanId);
  // dean.sessions.
  const existingSession = dean.sessions.find(
    (session) => session.startDateTime.toISOString() === startDateTime
  );

  return !existingSession; // Return true if the slot is available, false if it's booked
}
const getDeansAvailableSlotsById = async (req, res) => {
  console.log(req.params);
  const { deanId } = req.params;
  const slots = await getAvailableDeanSlots(deanId);
  res.status(200).json(slots ?? []);
};

async function getAvailableDeanSlots(deanId) {
  const today = new Date();
  const nextTwoMonths = new Date(today);
  nextTwoMonths.setMonth(today.getMonth() + 2);
  const dean = await Dean.findById(deanId);

  const bookedSessions = await dean.sessions.filter(
    (session) =>
      session.startDateTime >= today && session.startDateTime < nextTwoMonths
  );

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
const getAllDeans = async (req, res) => {
  const deans = await Dean.find();
  res.status(200).json(deans);
};

export default { login, bookSlot, getAllDeans, getDeansAvailableSlotsById };
