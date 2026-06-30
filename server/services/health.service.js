/**
 * Returns the current health status of the API process.
 * Kept separate from the controller so additional checks
 * (DB ping, external dependencies, etc.) can be added later
 * without touching the HTTP layer.
 */
function getHealthStatus() {
  return {
    status: "ok",
    uptime: process.uptime(),
  };
}

module.exports = {
  getHealthStatus,
};