const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true,
    default: "global"
  },
  visitorCount: {
    type: Number,
    default: 0
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Stats", statsSchema);
