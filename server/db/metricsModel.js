const pool = require("./pool");

/**
 * Inserts a single monitoring result into the api_metrics table.
 *
 * @param {Object} data
 * @param {string} data.url - The URL that was monitored.
 * @param {number|null} data.statusCode - HTTP status code returned (null if request failed entirely).
 * @param {number|null} data.responseTimeMs - Time taken for the request, in milliseconds.
 * @param {boolean} data.success - Whether the request was considered successful.
 * @param {string|null} data.errorMessage - Error message, if any.
 * @returns {Promise<Object>} The inserted row.
 */
async function saveMetric(data) {
  const { url, statusCode, responseTimeMs, success, errorMessage } = data;

  const query = `
    INSERT INTO api_metrics
      (url, status_code, response_time_ms, success, error_message)
    VALUES
      ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [
    url,
    statusCode ?? null,
    responseTimeMs ?? null,
    success,
    errorMessage ?? null,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

module.exports = {
  saveMetric,
};