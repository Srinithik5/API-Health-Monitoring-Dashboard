const { runMonitoringCycle } = require("../services/monitorService");

/**
 * GET /monitor/run
 * Triggers a monitoring cycle across all configured APIs,
 * persists each result, and returns a summary.
 */
async function runMonitor(req, res, next) {
  try {
    const results = await runMonitoringCycle();

    const total = results.length;
    const success = results.filter((r) => r.success).length;
    const failed = total - success;

    res.status(200).json({
      total,
      success,
      failed,
    });
  } catch (error) {
    // runMonitoringCycle is designed not to throw, but this guards
    // against unexpected failures (e.g. DB connection issues) so
    // the server never crashes from this route.
    next(error);
  }
}

module.exports = {
  runMonitor,
};