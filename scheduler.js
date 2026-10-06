import { getNextRun } from "./utils/candleTimer.js";
import { runCycle } from "./runCycle.js";

export function startScheduler() {

  function scheduleNext() {

    const delay = getNextRun();

    setTimeout(async () => {

      await runCycle();

      scheduleNext();

    }, delay);
  }

  scheduleNext();
}