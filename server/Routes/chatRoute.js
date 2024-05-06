import express from "express";
import {
  createChat,
  findChat,
  findUserChats,
} from "../Controllers/chatController.js";

const router = express.Router();

router.post("/", createChat);

router.get("/:userId", findUserChats);

router.get("/find/:firstId/:secondId", findChat);

export default router;
