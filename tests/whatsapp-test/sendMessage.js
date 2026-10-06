import axios from "axios";
import dotenv from "dotenv/config";

const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const MY_PHONE = process.env.MY_PHONE; // format: 91XXXXXXXXXX

export async function sendMessage(message) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: MY_PHONE,
        type: "text",
        text: {
          body: message
        }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Message sent:", response.data);

  } catch (error) {
    console.error(
      "❌ WhatsApp API Error:",
      error.response?.data || error.message
    );
  }
}