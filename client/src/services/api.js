import axios from "axios";

const BASE_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

/**
 * GET /analytics/summary
 * { totalRequests, successRate, failureRate, avgResponseTime }
 */
export async function getSummary() {
  const { data } = await api.get("/analytics/summary");
  return data;
}

/**
 * GET /analytics/uptime
 * [{ url, uptime, avgResponseTime, totalChecks }]
 */
export async function getUptime() {
  const { data } = await api.get("/analytics/uptime");
  return data;
}

/**
 * GET /analytics/latency
 * [{ url, avgResponseTime }]
 */
export async function getLatency() {
  const { data } = await api.get("/analytics/latency");
  return data;
}

/**
 * GET /monitor/run
 * { total, success, failed }
 */
export async function runMonitor() {
  const { data } = await api.get("/monitor/run");
  return data;
}

export default api;