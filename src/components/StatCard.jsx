function StatCard({ title, value, icon, unit }) {
  return (
    <div className="stat-card stat-card-animate">
      {icon && (
        <div className="stat-icon">
          {icon}
        </div>
      )}

      <p className="stat-title">{title}</p>

      <h3>
        <span className="stat-value">
          {value}
          {unit && (
            <span className="stat-label">
              {unit}
            </span>
          )}
        </span>
      </h3>
    </div>
  );
}

export default StatCard;
