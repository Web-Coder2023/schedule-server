import Event from "../models/Event.js";
import User from "../models/user.js";

// Получение всех активных событий
export const getEvents = async (req, res) => {
  try {
    const currentDate = new Date(); // Текущая дата
    const events = await Event.find({
      archived: false, // Только из общего списка
      actived: true,   // События, которые активны
      date: { $gte: currentDate }, // События с датой >= текущей
    });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};


// Получение архивированных событий
export const getArchivedEvents = async (req, res) => {
  try {
    const events = await Event.find({ archived: true });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching archived events", error });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { body } = req;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null; // Проверка на наличие файла

    // Создание мероприятия с путём к изображению
    const event = new Event({
      ...body,
      image: imagePath, // Сохранение пути к изображению
      archived: true,
      actived: true, // Отображается в общем списке
    });

    await event.save(); // Сохраняем мероприятие в базе данных

    res.status(201).json(event); // Возвращаем созданное событие, включая путь к изображению
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error });
  }
};
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const updatedData = { ...body };
    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`; // Обновляем изображение
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error });
  }
};


// Удаление события
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const archivedEvent = await Event.findByIdAndUpdate(id, { archived: true }, { new: true }); // Архивируем вместо удаления
    res.status(200).json({ message: "Event archived successfully", event: archivedEvent });
  } catch (error) {
    res.status(500).json({ message: "Error archiving event", error });
  }
};


// Архивирование события
export const archiveEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const archivedEvent = await Event.findByIdAndUpdate(id, { archived: true }, { new: true });
    res.status(200).json(archivedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error archiving event", error });
  }
};

// Восстановление события из архива
export const restoreEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const restoredEvent = await Event.findByIdAndUpdate(id, { archived: false }, { new: true });
    res.status(200).json(restoredEvent);
  } catch (error) {
    res.status(500).json({ message: "Error restoring event", error });
  }
};

// Записать пользователя на мероприятие
export const registerUserForEvent = async (req, res) => {
  try {
    const { id } = req.params; // ID мероприятия
    const { userId } = req.body; // ID пользователя

    // Находим мероприятие по ID
    const event = await Event.findById(id);

    // Проверяем, что мероприятие существует
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Проверяем, что количество участников не превышает максимальное
    if (event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ message: "Event is full" });
    }

    // Проверяем, что пользователь существует
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Добавляем пользователя в список участников
    event.participants.push({ userId });
    await event.save(); // Сохраняем обновленное мероприятие

    res.status(200).json(event); // Возвращаем обновленное мероприятие
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Отписать пользователя от мероприятия
export const unregisterUserFromEvent = async (req, res) => {
  try {
    const { id, userId } = req.params; // ID мероприятия и ID пользователя

    // Находим мероприятие по ID
    const event = await Event.findById(id);

    // Проверяем, что мероприятие существует
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Находим индекс пользователя в массиве участников
    const participantIndex = event.participants.findIndex(
      (participant) => participant.userId.toString() === userId
    );

    // Если участник не найден
    if (participantIndex === -1) {
      return res.status(404).json({ message: "User not registered for this event" });
    }

    // Удаляем пользователя из массива участников
    event.participants.splice(participantIndex, 1);
    await event.save(); // Сохраняем обновленное мероприятие

    res.status(200).json(event); // Возвращаем обновленное мероприятие
  } catch (error) {
    res.status(500).json({ message: "Error unregistering user", error });
  }
};
