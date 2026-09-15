import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getChats,
  createChat,
  getChatById,
  getOrCreateChat,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getChats);
router.post("/", createChat);
router.get("/:id", getChatById);
router.post("/get-or-create", getOrCreateChat);

export default router;