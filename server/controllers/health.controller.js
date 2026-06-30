const healthService = require("../services/health.service");

function getHealth(req, res) {
  const health = healthService.getHealthStatus();
  res.status(200).json(health);
}

module.exports = {
  getHealth,
};