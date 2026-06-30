const pool = require("./pool");

/**
 * Overall summary across ALL monitored APIs:
 * total requests, success/failure rate, and average response time.
 * All aggregation is done in SQL — no JS loops over rows.
 */
async function getSummary() {
  const query = `
    SELECT
      COUNT(*)::int                                            AS total_requests,
      COUNT(*) FILTER (WHERE success = TRUE)::int               AS success_count,
      COUNT(*) FILTER (WHERE success = FALSE)::int              AS failure_count,
      ROUND(AVG(response_time_ms))::int                         AS avg_response_time
    FROM api_metrics;
  `;

  const result = await pool.query(query);
  return result.rows[0];
}

/**
 * Per-URL uptime percentage, average response time, and total checks.
 * Uptime = (successful checks / total checks) * 100, rounded to 2 decimals.
 */
async function getUptimeByUrl() {
  const query = `
    SELECT
      url,
      ROUND(
        (COUNT(*) FILTER (WHERE success = TRUE)::numeric / COUNT(*)::numeric) * 100,
        2
      )                                                          AS uptime,
      ROUND(AVG(response_time_ms))::int                          AS avg_response_time,
      COUNT(*)::int                                               AS total_checks
    FROM api_metrics
    GROUP BY url
    ORDER BY url;
  `;

  const result = await pool.query(query);
  return result.rows;
}

/**
 * Per-URL average response time (latency), sorted slowest first.
 */
async function getLatencyByUrl() {
  const query = `
    SELECT
      url,
      ROUND(AVG(response_time_ms))::int AS avg_response_time
    FROM api_metrics
    WHERE response_time_ms IS NOT NULL
    GROUP BY url
    ORDER BY avg_response_time DESC;
  `;

  const result = await pool.query(query);
  return result.rows;
}

module.exports = {
  getSummary,
  getUptimeByUrl,
  getLatencyByUrl,
};