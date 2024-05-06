import mongoose from "mongoose";

const roomSchema = mongoose.Schema(
  {
    name: { type: String, trim: true, maxLength: 30, required: true },
    members: [String],
  },
  {
    timestamps: true,
  }
);

const roomModal = new mongoose.model("Room", roomSchema);

export default roomModal;
