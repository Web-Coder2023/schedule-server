import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/eventRoutes.js"; // Импорт маршрута событий

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
    'http://localhost:3000',
    'http://45.67.58.204:3000'
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      // Разрешаем запросы с указанных источников, если origin присутствует в allowedOrigins
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true); // null - отсутствие ошибок, true - разрешение запроса
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  }));
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

// Маршруты
app.use("/api/auth", authRoutes);
app.use("/api", eventRoutes); // Подключаем маршрут для событий

// Запуск сервера
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
