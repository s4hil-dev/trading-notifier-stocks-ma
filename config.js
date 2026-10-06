import {nifty500} from "./data/nifty500.js";
import { fno } from "./data/fno.js";
import { screen } from "./data/screen.js";

export const TIMEFRAME = 60;   // change to 15 later

export const DaysToFetch = TIMEFRAME == 15 ? 7 : 30;


// Change this value to choose the symbols the notifier monitors.
export const ACTIVE_LIST = "fno";


const symbolLists = {
  nifty500,
  fno,
  screen

};

export const stocks = symbolLists[ACTIVE_LIST];

if (!stocks) {
  throw new Error(`Unknown ACTIVE_LIST: ${ACTIVE_LIST}`);
}
