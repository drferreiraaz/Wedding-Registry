import React from 'react';

function StatCard({ icon, label, value, unit, className = '' }) {
  return (
    <div className={`bg-surface border border-border-light rounded-md p-md flex flex-col gap-xs min-w-0 ${className}`}>
      <div className="w-10 h-10 rounded-sm bg-primary-lighter flex items-center justify-center text-primary mb-xs">
        {icon}
      </div>
      <span className="text-[0.8rem] text-text-secondary font-normal">{label}</span>
      <div className="flex items-baseline gap-xs">
        <span className="font-serif text-[1.35rem] font-semibold text-text-primary">{value}</span>
        {unit && <span className="text-[0.8rem] text-text-muted">{unit}</span>}
      </div>
    </div>
  );
}

export default StatCard;
