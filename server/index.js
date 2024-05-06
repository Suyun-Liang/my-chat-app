import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import { default as userRouter } from "./Routes/userRoute.js";
import { default as chatRouter } from "./Routes/chatRoute.js";
import { default as messageRouter } from "./Routes/messageRoute.js";
import { default as roomRouter } from "./Routes/roomRoute.js";

const PORT = process.env.PORT || 5000;
const URI = process.env.DB_URI;
const app = express();

main();

async function main() {
  try {
    await mongoose.connect(URI);
    console.log("MongoDB connection established");
  } catch (error) {
    console.log("MongoDB connection failed: ", error.message);
  }
}

app.use(express.json());
app.use(cors());
app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);
app.use("/api/rooms", roomRouter);

//CRUD
app.get("/", (req, res) => {
  res.send("welcome to our chatApp");
});

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port: ${PORT}`);
});
