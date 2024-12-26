import multer from "multer";
import path from "path";

// Устанавливаем директорию для хранения загружаемых файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Папка, куда будут сохраняться файлы
  },
  filename: (req, file, cb) => {
    // Генерируем уникальное имя для файла
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Проверяем тип файла
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed."));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Ограничение: 5 MB
  fileFilter,
});

export default upload;
