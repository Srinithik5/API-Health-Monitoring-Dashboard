function SummaryCard({ label, value, suffix = "", tone = "neutral" }) {
  return (
    <div className={`summary-card summary-card--${tone}`}>
      <span className="summary-card__label">{label}</span>
      <span className="summary-card__value">
        {value}
        {suffix && <span className="summary-card__suffix">{suffix}</span>}
      </span>
    </div>
  );
}

export default SummaryCard;