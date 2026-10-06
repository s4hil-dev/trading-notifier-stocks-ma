import mongoose from "mongoose";

const indicatorSchema = new mongoose.Schema({

  symbol: { type: String, unique: true },

  ema12: Number,
  ema26: Number,

  macdQueue: {
    type: [Number],
    default: []
  },

  // The latest 20 closes are required to calculate SMA-20 exactly.
  closeQueue: {
    type: [Number],
    default: []
  },

  ma10Ma20Queue: {
    type: [Number],
    default: []
  },

  lastCandleTime: Date

});

export default mongoose.model("Indicator", indicatorSchema);
