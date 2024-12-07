// routes/auth.js
import express from "express";
import { registerUser, loginUser, refreshToken, getUserProfile, logoutUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutUser);  // Новый маршрут для выхода

// Новый маршрут для получения данных пользователя
router.get("/profile", protect, getUserProfile);

export default router;
