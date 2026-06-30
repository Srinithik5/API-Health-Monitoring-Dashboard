function StatusBanner({ type, message }) {
  if (!message) return null;

  return (
    <div className={`status-banner status-banner--${type}`} role="status">
      {message}
    </div>
  );
}

export default StatusBanner;