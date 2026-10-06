import Indicator from "./models/indicatorModel.js";
import { fetchLastCandle } from "./services/fetchLastCandle.js";
import { updateMA10MA20 } from "./services/movingAverageCalculator.js";
import { checkMA10MA20 } from "./services/strategy.js";
import 'dotenv/config';
import { stocks, TIMEFRAME } from "./config.js";
import { queueAlert } from "./queues/alertQueue.js";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processSymbol(symbol) {

  try {

    const indicator = await Indicator.findOne({ symbol });

    const candle = await fetchLastCandle(symbol);

    const candleTime = new Date(candle[0] * 1000);

    console.log(candleTime);

    const close = candle[4];

    console.log(symbol, close);

    console.log("DB candle:", indicator.lastCandleTime.toLocaleString());
    console.log("API candle:", candleTime.toLocaleString());

    // skip if candle already processed
    if (indicator.lastCandleTime.getTime() === candleTime.getTime()) return;

    const maResult = updateMA10MA20(close, indicator.closeQueue || []);
    const maQueue = indicator.ma10Ma20Queue || [];

    if (maResult.difference !== null) {
      maQueue.push(maResult.difference);
      if (maQueue.length > 3) maQueue.shift();
    }

    console.log("SMA values:", {
      sma20: maResult.ma20,
      sma10: maResult.ma10,
      difference: maResult.difference
    });
    console.log("SMA 10 - SMA 20 queue:", maQueue);

    // STRATEGY CHECK: notify immediately when the three-candle pattern forms.
    const maSignal = checkMA10MA20(maQueue);

    if (maSignal) {
      console.log(`SMA 10 - SMA 20 ${maSignal} Signal:`, symbol);

      const indianTime = candleTime.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata"
      });

      const message =
      `SMA 10 - SMA 20 Signal Alert

      Stock: ${symbol}
      Signal: ${maSignal}
      Timeframe: ${TIMEFRAME}
      Time: ${indianTime}`;

      try {
        await queueAlert(message);
      } catch (err) {
        console.log("WhatsApp error:", err.message);
      }
    }

    indicator.closeQueue = maResult.closes;
    indicator.ma10Ma20Queue = maQueue;
    indicator.lastCandleTime = candleTime;

    await indicator.save();

    /* MACD strategy disabled.
    // STRATEGY CHECK
    const signal = checkMACD(queue);

    if (signal) {

      console.log(`${signal} Signal:`, symbol);

      const indianTime = candleTime.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata"
      });

      const message =
      `📈 MACD Signal Alert

      Stock: ${symbol}
      Signal: ${signal}
      Timeframe: ${TIMEFRAME}
      Time: ${indianTime}`;

      try {
        await queueAlert(message);
      } catch (err) {
        console.log("WhatsApp error:", err.message);
      }
    }

    */
    /* Alert moved to directly after the strategy check.
    const maSignal = checkMA10MA20(maQueue);

    if (maSignal) {

      console.log(`SMA 10 - SMA 20 ${maSignal} Signal:`, symbol);

      const indianTime = candleTime.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata"
      });

      const message =
      `SMA 10 - SMA 20 Signal Alert

      Stock: ${symbol}
      Signal: ${maSignal}
      Timeframe: ${TIMEFRAME}
      Time: ${indianTime}`;

      try {
        await queueAlert(message);
      } catch (err) {
        console.log("WhatsApp error:", err.message);
      }
    }

    */
  } catch (err) {

    console.log("Error processing:", symbol);
    console.log(err.response?.data || err.message || err);

  }
}

export async function runCycle() {

  for (const symbol of stocks) {

    try {
      await processSymbol(symbol);
    } catch (err) {
      console.log("Cycle error:", symbol);
    }

    // Rate limit protection
    await sleep(200);

  }

}
