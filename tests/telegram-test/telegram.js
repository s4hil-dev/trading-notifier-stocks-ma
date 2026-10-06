import axios from "axios";
import "dotenv/config";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function sendMessage(message) {
  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Telegram message sent:", response.data);
  } catch (error) {
    console.error(
      "❌ Telegram API Error:",
      error.response?.data || error.message
    );
  }
}