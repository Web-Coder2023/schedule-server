import TelegramBot from 'node-telegram-bot-api';
import mongoose from 'mongoose';
import User from './models/user.js';

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Listen for the /start command with a token
bot.onText(/\/start (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const confirmationToken = match[1];

    try {
        const user = await User.findOne({ confirmationToken });
        if (user) {
            user.isConfirmed = true; // Mark user as confirmed
            user.confirmationToken = null; // Clear the token
            await user.save();

            bot.sendMessage(chatId, "Спасибо, ваш аккаунт подтвержден! Вы можете вернуться на сайт.");
        } else {
            bot.sendMessage(chatId, "Неверный или устаревший токен. Пожалуйста, попробуйте снова.");
        }
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "Произошла ошибка. Пожалуйста, попробуйте позже.");
    }
});
