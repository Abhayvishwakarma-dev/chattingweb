import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getUsers,
  getUserById,
  updateUser,
  searchUsers,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getUsers);
router.get("/search", searchUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);

export default router;