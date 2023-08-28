import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  dean: { type: mongoose.Schema.Types.ObjectId, ref: "Dean" },
  startDateTime: { type: Date, required: true },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Session = mongoose.model("Session", sessionSchema);
export default Session;
