// controllers/userController.js
import User from "../models/user.js";

// Получение пользователя по его ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      name: user.name,
      subname: user.subname,
      phone: user.phone,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};
