import userModal from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config.js";
import validator from "validator";

const SALT_ROUNDS = 10;

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET_KEY, { expiresIn: "2 days" });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await userModal.findOne({ email });

    if (user)
      return res.status(400).json("user with the given email already exists");

    if (!name || !email || !password)
      return res.status(400).json("All feilds are required");

    if (!validator.isEmail(email))
      return res.status(400).json("Please enter a valid email");

    if (!validator.isStrongPassword(password))
      return res.status(400).json("Password must be a strong password");

    user = new userModal({ name, email, password });
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);

    await user.save();

    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, name, email, token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await userModal.findOne({ email });

    if (!user) return res.status(400).json("Invalid email or password");

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return res.status(400).json("Invalid email or password");

    const token = createToken(user._id);
    res.status(200).json({ _id: user._id, name: user.name, email, token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error);
  }
};

export const findUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await userModal.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error);
  }
};

export const getUsers = async (req, res) => {
  try {
    // get all users with all fields but password field
    const users = await userModal.find({}, { password: 0 });
    res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error);
  }
};
