// routes/userRoutes.js
import express from "express";
import { getUserById } from "../controllers/userController.js";

const router = express.Router();

// Получение пользователя по ID
router.get("/users/:id", getUserById);

export default router;
