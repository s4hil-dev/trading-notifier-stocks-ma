import Indicator from "../models/indicatorModel.js";
import { fetchHistoricalCandles } from "./fetchHistorical.js";

function calculateEMA(prices, period) {

  const k = 2 / (period + 1);

  // --- seed EMA using SMA ---
  let sma = 0;
  for (let i = 0; i < period; i++) {
    sma += prices[i];
  }

  let ema = sma / period;

  // --- continue EMA calculation ---
  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }

  return ema;
}

export async function bootstrap(symbol) {

  const exists = await Indicator.findOne({ symbol });

  if (exists?.closeQueue?.length >= 20) {
    console.log(`Bootstrap skipped for ${symbol} (already exists)`);
    return;
  }

  const candles = await fetchHistoricalCandles(symbol);

  console.log(`\n========== BOOTSTRAP DEBUG : ${symbol} ==========`);

  console.log("Total candles fetched:", candles.length);

  console.log("Last candle from API:", candles[candles.length - 1]);
  console.log("Second last candle (closed):", candles[candles.length - 2]);

  // remove forming candle
  const closedCandles = candles.slice(0, -1);

  console.log("Closed candles used:", closedCandles.length);

  const closes = closedCandles.map(c => c[4]);

  console.log("Last 5 closes used for EMA:", closes.slice(-5));

  // --- calculate EMAs ---
  const ema12 = calculateEMA(closes.slice(-100), 12);
  const ema26 = calculateEMA(closes.slice(-100), 26);

  console.log("Calculated EMA12:", ema12);
  console.log("Calculated EMA26:", ema26);

  // last closed candle timestamp
  const lastClosedTime = new Date(
    closedCandles[closedCandles.length - 1][0] * 1000
  );

  console.log("Last closed candle time:", lastClosedTime);

  // Existing records predate the SMA strategy. Backfill its price history
  // without changing the already-persisted MACD or candle position.
  if (exists) {
    exists.closeQueue = closes.slice(-20);
    exists.ma10Ma20Queue = [];
    await exists.save();

    console.log(`SMA history backfilled for ${symbol}`);
    console.log("==============================================\n");
    return;
  }

  await Indicator.create({
    symbol,
    ema12,
    ema26,
    macdQueue: [],
    closeQueue: closes.slice(-20),
    ma10Ma20Queue: [],
    lastCandleTime: lastClosedTime
  });

  console.log(`Bootstrap completed for ${symbol}`);
  console.log("==============================================\n");
}
