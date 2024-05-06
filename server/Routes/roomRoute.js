import express from "express";
import {
  createRoom,
  findAllRooms,
  joinRoom,
  leaveRoom,
} from "../Controllers/roomController.js";

const router = express.Router();

// get all rooms
router.get("/", findAllRooms);

// create a room
router.post("/", createRoom);

// join a room
router.patch("/join/:roomId", joinRoom);

// leave a room
router.patch("/leave/:roomId", leaveRoom);

export default router;
