import User from "../models/user.js";
import jwt from "jsonwebtoken";

// Генерация токена
const generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET, {
        expiresIn: "1h", // Устанавливаем срок действия токена на 1 час
    });
};

// Получение данных пользователя
export const getUserProfile = async (req, res) => {
    try {
        // Здесь мы уже проверяем токен в middleware protect, поэтому можем просто вернуть данные пользователя
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ error: "Error fetching user profile" });
    }
};

// Регистрация пользователя
export const registerUser = async (req, res) => {
    const { name, subname, phone, password } = req.body;

    try {
        const userExists = await User.findOne({ phone });
        if (userExists) {
            return res.status(400).json({ error: "Phone number already exists" });
        }

        const user = new User({ name, subname, phone, password });
        await user.save();

        const token = generateToken(user._id, user.role);

        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
};

// Авторизация пользователя
export const loginUser = async (req, res) => {
    const { phone, password } = req.body;

    try {
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Генерация нового токена
        const token = generateToken(user._id, user.role);

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: "Error logging in" });
    }
};

// Обновление токена (если токен близок к истечению)
export const refreshToken = (req, res) => {
    const { token } = req.body;
    
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Генерация нового токена
        const newToken = generateToken(decoded.id, decoded.role);

        res.status(200).json({ token: newToken });
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

// Выход пользователя (удаление токена)
export const logoutUser = (req, res) => {
    try {
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error logging out" });
    }
};