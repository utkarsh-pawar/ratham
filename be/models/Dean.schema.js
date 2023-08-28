import mongoose from "mongoose";

const deanSchema = new mongoose.Schema({
  universityID: { type: String, required: true },
  password: { type: String, required: true },
  uniqueId: { type: String },
});

const Dean = mongoose.model("Dean", deanSchema);
export default Dean;
