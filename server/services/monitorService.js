const axios = require("axios");
const { saveMetric } = require("../db/metricsModel");

// Hardcoded list of APIs to monitor for Phase 2.
// In a later phase this can be moved into the database / a config table.
const MONITORED_APIS = [
  "https://jsonplaceholder.typicode.com/posts",
  "https://api.github.com",
  "https://httpstat.us/500",
];

// How long to wait before giving up on a single ping (ms).
const REQUEST_TIMEOUT_MS = 10000;

/**
 * Pings a single URL, measures response time, and persists the result.
 * This function NEVER throws — any failure (network error, timeout,
 * non-2xx response) is captured and stored as a failed metric instead
 * of bubbling up and crashing the caller.
 *
 * @param {string} url
 * @returns {Promise<Object>} The saved metric row.
 */
async function pingApi(url) {
  const startTime = Date.now();

  try {
    const response = await axios.get(url, {
      timeout: REQUEST_TIMEOUT_MS,
      // Treat any HTTP response (including 4xx/5xx) as "got a response" —
      // we decide success/failure ourselves based on the status code below.
      validateStatus: () => true,
    });

    const responseTimeMs = Date.now() - startTime;
    const statusCode = response.status;
    const success = statusCode >= 200 && statusCode < 400;

    const metric = await saveMetric({
      url,
      statusCode,
      responseTimeMs,
      success,
      errorMessage: success ? null : `Received non-success status code: ${statusCode}`,
    });

    return metric;
  } catch (error) {
    const responseTimeMs = Date.now() - startTime;

    // Covers network errors, DNS failures, timeouts, connection resets, etc.
    const metric = await saveMetric({
      url,
      statusCode: error.response ? error.response.status : null,
      responseTimeMs,
      success: false,
      errorMessage: error.message || "Unknown error during request",
    });

    return metric;
  }
}

/**
 * Runs a monitoring pass across all configured APIs.
 * Each ping is independent — a failure on one URL does not
 * affect the others, and nothing here throws.
 *
 * @returns {Promise<Object[]>} Array of saved metric rows.
 */
async function runMonitoringCycle() {
  const results = await Promise.all(
    MONITORED_APIS.map((url) => pingApi(url))
  );

  return results;
}

module.exports = {
  MONITORED_APIS,
  pingApi,
  runMonitoringCycle,
};