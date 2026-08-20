import React from 'react';
import './style.css';

function StatCard({ icon, label, value, unit, className = '' }) {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-card-icon">{icon}</div>
      <span className="stat-card-label">{label}</span>
      <div className="stat-card-value-row">
        <span className="stat-card-value">{value}</span>
        {unit && <span className="stat-card-unit">{unit}</span>}
      </div>
    </div>
  );
}

export default StatCard;