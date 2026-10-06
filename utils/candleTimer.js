// MARKET GUARDED

import { TIMEFRAME } from "../config.js";

export function getNextRun() {

  // ✅ Force IST time
  const now = new Date();
  const istNow = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const next = new Date(istNow);

  const marketOpen = new Date(istNow);
  marketOpen.setHours(9, 15, 0, 0);

  const marketClose = new Date(istNow);
  marketClose.setHours(15, 30, 0, 0);

  // Before market open
  if (istNow < marketOpen) {
    console.log("Waiting for market open");
    return marketOpen - istNow;
  }

  // After market close
  if (istNow >= marketClose) {
    const tomorrowOpen = new Date(marketOpen);
    tomorrowOpen.setDate(tomorrowOpen.getDate() + 1);

    console.log("Market closed, scheduling tomorrow");
    return tomorrowOpen - istNow;
  }

  next.setSeconds(2);
  next.setMilliseconds(0);

  const startMinutes = 15;
  const interval = TIMEFRAME;

  const minutes = istNow.getMinutes();

  const blocks = Math.ceil((minutes - startMinutes) / interval);
  const nextMinute = startMinutes + blocks * interval;

  next.setMinutes(nextMinute);

  if (next <= istNow) next.setMinutes(next.getMinutes() + interval);

  const delay = next - istNow;

  console.log("Current Time:", istNow.toLocaleTimeString());
  console.log("Next Run:", next.toLocaleTimeString());

  return delay;
}