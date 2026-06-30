import { useCallback, useEffect, useState } from "react";
import SummaryCards from "../components/SummaryCards";
import RunMonitorButton from "../components/RunMonitorButton";
import StatusBanner from "../components/StatusBanner";
import UptimeChart from "../charts/UptimeChart";
import LatencyChart from "../charts/LatencyChart";
import { getSummary, getUptime, getLatency, runMonitor } from "../services/api";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [uptime, setUptime] = useState([]);
  const [latency, setLatency] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const [lastRunMessage, setLastRunMessage] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setError(null);
    try {
      const [summaryData, uptimeData, latencyData] = await Promise.all([
        getSummary(),
        getUptime(),
        getLatency(),
      ]);

      setSummary(summaryData);
      setUptime(uptimeData);
      setLatency(latencyData);
    } catch (err) {
      setError(
        "Could not load dashboard data. Check that the backend is running on http://localhost:5000."
      );
    }
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await fetchDashboardData();
      setIsLoading(false);
    })();
  }, [fetchDashboardData]);

  const handleRunMonitor = async () => {
    setIsRunning(true);
    setLastRunMessage(null);
    setError(null);

    try {
      const result = await runMonitor();
      setLastRunMessage(
        `Checked ${result.total} APIs — ${result.success} healthy, ${result.failed} failed.`
      );
      await fetchDashboardData();
    } catch (err) {
      setError("Monitoring run failed. Check that the backend is running on http://localhost:5000.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="dashboard__title-group">
          <span className="dashboard__pulse" aria-hidden="true" />
          <div>
            <h1 className="dashboard__title">API Health Monitor</h1>
            <p className="dashboard__subtitle">Live status across monitored endpoints</p>
          </div>
        </div>
        <RunMonitorButton onRun={handleRunMonitor} isRunning={isRunning} />
      </header>

      <StatusBanner type="error" message={error} />
      <StatusBanner type="success" message={!error ? lastRunMessage : null} />

      {isLoading ? (
        <p className="dashboard__loading">Loading dashboard…</p>
      ) : (
        <>
          <SummaryCards summary={summary} />

          <section className="chart-grid">
            <div className="chart-panel">
              <h2 className="chart-panel__title">Uptime by API</h2>
              <UptimeChart data={uptime} />
            </div>

            <div className="chart-panel">
              <h2 className="chart-panel__title">Latency by API</h2>
              <LatencyChart data={latency} />
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default Dashboard;