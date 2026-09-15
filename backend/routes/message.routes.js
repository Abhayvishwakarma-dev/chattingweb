import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getMessages,
  deleteMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.use(protect);

router.get("/:chatId", getMessages);
router.delete("/:id", deleteMessage);

export default router;