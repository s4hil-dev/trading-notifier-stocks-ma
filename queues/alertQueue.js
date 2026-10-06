import PQueue from "p-queue";
import { sendMessage } from "../tests/whatsapp-test/sendMessage.js";
import { sendMessage as sendTelegramMessage } from "../tests/telegram-test/telegram.js";

const alertQueue = new PQueue({
  concurrency: 1,        // send one message at a time
  intervalCap: 20,       // max messages
  interval: 1000         // per second
});

export function queueAlert(message) {
  alertQueue.add(() => sendTelegramMessage(message));
}

//NOT REQUIRED