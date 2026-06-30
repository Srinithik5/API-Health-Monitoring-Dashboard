function RunMonitorButton({ onRun, isRunning }) {
  return (
    <button
      type="button"
      className="run-button"
      onClick={onRun}
      disabled={isRunning}
    >
      <span className={`run-button__dot ${isRunning ? "run-button__dot--spin" : ""}`} />
      {isRunning ? "Running..." : "Run Monitoring"}
    </button>
  );
}

export default RunMonitorButton;