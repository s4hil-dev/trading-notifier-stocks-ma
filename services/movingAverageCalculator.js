function calculateSMA(prices) {
  return prices.reduce((total, price) => total + Number(price), 0) / prices.length;
}

export function updateMA10MA20(close, previousCloses) {
  const closes = [...previousCloses, Number(close)].slice(-20);

  if (closes.length < 20) {
    return { closes, ma10: null, ma20: null, difference: null };
  }

  const ma10 = calculateSMA(closes.slice(-10));
  const ma20 = calculateSMA(closes);

  return {
    closes,
    ma10,
    ma20,
    difference: ma10 - ma20
  };
}
