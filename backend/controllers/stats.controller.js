const Stats = require("../models/Stats");

exports.incrementVisitors = async (req, res) => {
  try {
    const stats = await Stats.findOneAndUpdate(
      { type: "global" },
      { $inc: { visitorCount: 1 }, lastUpdate: Date.now() },
      { upsert: true, returnDocument: "after" }
    );
    res.json({ success: true, count: stats.visitorCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await Stats.findOne({ type: "global" });
    res.json({ 
      success: true, 
      count: stats ? stats.visitorCount : 0 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
