import express from "express";
import https from "https";
import fs from "fs";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import cron from "node-cron";
import Event from "./models/Event.js";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/eventRoutes.js"; // Импорт маршрута событий
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  'https://dungeons-lounge.ru', // всегда разрешаем для продакшн
];

// Добавляем разрешение для локальной разработки, если NODE_ENV = development
if (process.env.NODE_ENV === "development") {
  allowedOrigins.push('http://localhost:3000'); // добавляем для локальной разработки
}

// Ежедневная проверка событий
cron.schedule("0 0 * * *", async () => {
    const currentDate = new Date();
    try {
      // Скрываем события, чья дата истекла
      await Event.updateMany(
        { date: { $lt: currentDate }, actived: true }, // События с прошедшей датой
        { actived: false } // Делаем неактивными
      );
      console.log("Archived outdated events successfully");
    } catch (error) {
      console.error("Error archiving outdated events:", error);
    }
  });

app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true); // null - отсутствие ошибок, true - разрешение запроса
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));
app.use("/api/auth", authRoutes);
app.use("/api", eventRoutes);
app.use("/api", userRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Для продакшн окружения
let server;
if (process.env.NODE_ENV === "production") {
    // При деплое используем HTTPS с сертификатами
    const options = {
        key: fs.readFileSync('/etc/letsencrypt/live/dungeons-lounge.ru/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/dungeons-lounge.ru/fullchain.pem'),
        ca: fs.readFileSync('/etc/letsencrypt/live/dungeons-lounge.ru/chain.pem')
    };

    server = https.createServer(options, app);
    const port = process.env.PORT || 8000;
    server.listen(port, () => {
        console.log(`Server is running on https://dungeons-lounge.ru:${port}`);
    });
} else {
    // Для разработки используем HTTP
    const port = process.env.PORT || 8000;
    server = app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}
