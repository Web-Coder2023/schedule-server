import express from "express";
import https from "https";
import fs from "fs";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/eventRoutes.js"; // Импорт маршрута событий

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  'https://webcraft-app.ru', // всегда разрешаем для продакшн
];

// Добавляем разрешение для локальной разработки, если NODE_ENV = development
if (process.env.NODE_ENV === "development") {
  allowedOrigins.push('http://localhost:3000'); // добавляем для локальной разработки
}

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

// Для продакшн окружения
let server;
if (process.env.NODE_ENV === "production") {
    // При деплое используем HTTPS с сертификатами
    const options = {
        key: fs.readFileSync('/etc/letsencrypt/live/webcraft-app.ru/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/webcraft-app.ru/fullchain.pem'),
        ca: fs.readFileSync('/etc/letsencrypt/live/webcraft-app.ru/chain.pem')
    };

    server = https.createServer(options, app);
    const port = process.env.PORT || 8000;
    server.listen(port, () => {
        console.log(`Server is running on https://webcraft-app.ru:${port}`);
    });
} else {
    // Для разработки используем HTTP
    const port = process.env.PORT || 8000;
    server = app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}
