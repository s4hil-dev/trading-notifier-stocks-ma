export function checkMACD(queue) {

  if (queue.length < 3) return null;

  const [m3, m2, m1] = queue;

  // Bullish: MACD crosses above 0
  if (m1 > 0 && m2 < 0 && m3 < 0) {
    return "🟢 BULLISH";
  }

  // Bearish: MACD crosses below 0
  // if (m1 < 0 && m2 > 0 && m3 > 0) {
  //   return "🔴 BEARISH";
  // }

return null;
}

export function checkMA10MA20(queue) {

  if (queue.length < 3) return null;

  const [m3, m2, m1] = queue;

  // SMA-10 - SMA-20 moves from below zero to above zero.
  if (m3 < 0 && m2 < 0 && m1 > 0) {
    return "🟢 BULLISH";
  }

  // SMA-10 - SMA-20 moves from above zero to below zero.
  if (m3 > 0 && m2 > 0 && m1 < 0) {
    return "🔴 BEARISH";
  }

  return null;
}
