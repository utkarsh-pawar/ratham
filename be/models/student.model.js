import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  universityID: { type: String, required: true },
  password: { type: String, required: true },
  uniqueId: { type: String },
});

const Student = mongoose.model("Student", studentSchema);
export default Student;
