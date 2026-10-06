import mongoose from "mongoose";
import { bootstrap } from "./services/bootstrap.js";
import { startScheduler } from "./scheduler.js";
import { stocks } from "./config.js";

import 'dotenv/config'

// Atlas creates this database when the application first writes a collection.
await mongoose.connect(process.env.DB_URI, { dbName: "sma_stocks" });

console.log("DB connected");

for (const symbol of stocks) {

  await bootstrap(symbol);

}

startScheduler();
