import express from "express";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  archiveEvent,
  restoreEvent,
  getArchivedEvents,
  registerUserForEvent,
  unregisterUserFromEvent,
} from "../controllers/eventController.js";
import { protect } from "../middleware/authMiddleware.js"; // Мидлвар для авторизации
import { isAdmin } from "../middleware/admin.js"; // Мидлвар для проверки админа
import upload from "../utils/multerConfig.js"; // Мидлвар для загрузки файла

const router = express.Router();

// Получение всех мероприятий (доступно всем пользователям)
router.get("/events", getEvents);

// Маршруты, доступные только админам
router.post("/events", protect, isAdmin, upload.single("image"), createEvent); // Создание и добавление в архив
router.put("/events/:id", protect, isAdmin, upload.single("image"), updateEvent); // Обновление записи
router.delete("/events/:id", protect, isAdmin, archiveEvent); // Архивируем вместо удаления
router.put("/events/:id/archive", protect, isAdmin, archiveEvent); // Архивируем событие
router.put("/events/:id/restore", protect, isAdmin, restoreEvent); // Восстановление события из архива

// Получение всех архивированных мероприятий (только для администраторов)
router.get("/archived-events", protect, isAdmin, getArchivedEvents);

// Записать пользователя на мероприятие
router.post("/events/:id/register", protect, registerUserForEvent);

// Отписать пользователя от мероприятия
router.delete("/events/:id/unregister/:userId", protect, unregisterUserFromEvent);

export default router;
