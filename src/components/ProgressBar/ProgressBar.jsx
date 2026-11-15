import React from 'react';

function ProgressBar({ value, max = 100, className = '', showLabel = true }) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-sm">
          <span className="text-[0.8rem] text-text-secondary font-normal">Progresso Geral</span>
          <span className="font-serif text-[1.5rem] font-semibold text-primary">{percentage}%</span>
        </div>
      )}
      <div className="w-full h-[6px] bg-progress-track rounded-[3px] overflow-hidden">
        <div
          className="h-full bg-primary rounded-[3px] transition-[width] duration-[600ms] ease-[ease]"
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
