import axios from "axios";
import "dotenv/config";

import { DaysToFetch } from "../config.js";
import { TIMEFRAME } from "../config.js";

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

function formatIST(date) {
  return date.toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" }).replace("T", " ");
}

export async function fetchHistoricalCandles(symbol) {

  const end = new Date();
  const start = new Date(end);

  start.setDate(end.getDate() - DaysToFetch); // Fetch data for the last 7/30 days for 15/60 min candles.

  const res = await axios.get(
    "https://api.groww.in/v1/historical/candle/range",
    {
      params: {
        exchange: "NSE",
        segment: "CASH",
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
  
  return res.data.payload.candles;
}