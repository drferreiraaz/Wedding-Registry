import React from 'react';
import './style.css';

function ProgressBar({ value, max = 100, className = '', showLabel = true }) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={`progress-bar ${className}`}>
      {showLabel && (
        <div className="progress-bar-labels">
          <span className="progress-bar-label">Progresso Geral</span>
          <span className="progress-bar-value">{percentage}%</span>
        </div>
      )}
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

export default ProgressBar;