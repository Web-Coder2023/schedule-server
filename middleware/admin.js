export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        return next();  // Если роль администратора, продолжаем выполнение запроса
    } else {
        return res.status(403).json({ error: "Not authorized as admin" });  // Доступ только для админов
    }
};
