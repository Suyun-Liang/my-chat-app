import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minLength: 3, maxLength: 30 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate: [isEmail, "invalid email"],
    },
    password: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 1024,
    },
  },
  { timestamps: true }
);

const userModal = new mongoose.model("User", userSchema);

export default userModal;
