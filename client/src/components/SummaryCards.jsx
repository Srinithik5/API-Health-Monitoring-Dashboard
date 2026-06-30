import SummaryCard from "./SummaryCard";

function SummaryCards({ summary }) {
  if (!summary) return null;

  const { totalRequests, successRate, failureRate, avgResponseTime } = summary;

  return (
    <section className="summary-grid" aria-label="Summary metrics">
      <SummaryCard label="Total requests" value={totalRequests} tone="neutral" />
      <SummaryCard label="Success rate" value={successRate} suffix="%" tone="good" />
      <SummaryCard label="Failure rate" value={failureRate} suffix="%" tone="bad" />
      <SummaryCard
        label="Avg response time"
        value={avgResponseTime}
        suffix=" ms"
        tone="neutral"
      />
    </section>
  );
}

export default SummaryCards;