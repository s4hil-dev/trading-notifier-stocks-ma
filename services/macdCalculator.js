export function updateMACD(close, ema12Prev, ema26Prev) {

  const k12 = 2 / (12 + 1);
  const k26 = 2 / (26 + 1);

  const ema12 = close * k12 + ema12Prev * (1 - k12);
  const ema26 = close * k26 + ema26Prev * (1 - k26);

  const macd = ema12 - ema26;

  return { ema12, ema26, macd };
}