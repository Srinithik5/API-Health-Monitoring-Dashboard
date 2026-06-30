const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

router.get("/summary", analyticsController.getSummary);
router.get("/uptime", analyticsController.getUptime);
router.get("/latency", analyticsController.getLatency);

module.exports = router;