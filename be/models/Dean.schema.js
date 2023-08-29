import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  startDateTime: { type: Date, required: true },
  completed: {
    type: Boolean,
    default: false,
  },
});

const deanSchema = new mongoose.Schema({
  universityID: { type: String, required: true },
  password: { type: String, required: true },
  uniqueId: { type: String },
  sessions: [sessionSchema], // Embed the sessionSchema directly
});

const Dean = mongoose.model("Dean", deanSchema);
export default Dean;
