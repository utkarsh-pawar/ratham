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

  await session.save();
  res.status(200).json("slot booked successfully");
};

async function checkSlotAvailability(startDateTime, deanId) {
  // Check if the slot is already booked
  const existingSession = await Session.findOne({
    startDateTime,
    dean: deanId,
  });

  return !existingSession; // Return true if the slot is available, false if it's booked
}

export default { login, bookSlot };
