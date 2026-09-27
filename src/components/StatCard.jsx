function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <p className="stat-title">{title}</p>
      <h3>{value}</h3>
    </div>
  );
}

export default StatCard;