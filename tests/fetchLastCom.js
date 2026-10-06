import axios from "axios";
import "dotenv/config";
import { TIMEFRAME } from "../config.js";

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

function formatIST(date) {
  return date.toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" }).replace("T", " ");
}

export async function fetchLastCandle(symbol) {

  const end = new Date();
  const start = new Date(end);
  start.setMinutes(end.getMinutes() - 4200);

  const res = await axios.get(
    "https://api.groww.in/v1/historical/candle/range",
    {
      params: {
        exchange: "MCX",
        segment: "COMMODITY",
        trading_symbol: symbol,
        interval_in_minutes: TIMEFRAME,
        start_time: formatIST(start),
        end_time: formatIST(end)
      },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "X-API-VERSION": "1.0"
      }
    }
  );

  const candles = res.data.payload.candles;

  if (!candles || candles.length < 2) {
    console.log("Not enough candles returned");
    return null;
  }

  const lastClosedCandle = candles[candles.length - 2];

  console.log("Last closed candle:", lastClosedCandle);

  return lastClosedCandle;
}

fetchLastCandle("CRUDEOILM18MAY26FUT")