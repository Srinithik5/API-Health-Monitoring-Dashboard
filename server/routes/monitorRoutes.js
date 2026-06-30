const express = require("express");
const router = express.Router();
const monitorController = require("../controllers/monitorController");

router.get("/run", monitorController.runMonitor);

module.exports = router;