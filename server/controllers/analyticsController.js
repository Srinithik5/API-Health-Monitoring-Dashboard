const analyticsModel = require("../db/analyticsModel");

/**
 * GET /analytics/summary
 * Returns overall request totals, success/failure rate, and avg response time.
 */
async function getSummary(req, res, next) {
  try {
    const row = await analyticsModel.getSummary();

    const totalRequests = row.total_requests || 0;
    const successCount = row.success_count || 0;
    const failureCount = row.failure_count || 0;

    const successRate =
      totalRequests > 0
        ? Number(((successCount / totalRequests) * 100).toFixed(2))
        : 0;

    const failureRate =
      totalRequests > 0
        ? Number(((failureCount / totalRequests) * 100).toFixed(2))
        : 0;

    res.status(200).json({
      totalRequests,
      successRate,
      failureRate,
      avgResponseTime: row.avg_response_time || 0,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /analytics/uptime
 * Returns per-API uptime percentage, average response time, and total checks.
 */
async function getUptime(req, res, next) {
  try {
    const rows = await analyticsModel.getUptimeByUrl();

    const uptime = rows.map((row) => ({
      url: row.url,
      uptime: Number(row.uptime),
      avgResponseTime: row.avg_response_time,
      totalChecks: row.total_checks,
    }));

    res.status(200).json(uptime);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /analytics/latency
 * Returns per-API average response time, slowest first.
 */
async function getLatency(req, res, next) {
  try {
    const rows = await analyticsModel.getLatencyByUrl();

    const latency = rows.map((row) => ({
      url: row.url,
      avgResponseTime: row.avg_response_time,
    }));

    res.status(200).json(latency);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSummary,
  getUptime,
  getLatency,
};