import React from 'react';
import { calculatePhaseProgress } from '../../utils/calculations';

function PhaseCard({ phase, onClick }) {
  const progress = calculatePhaseProgress(phase);
  const completedCount = phase.tasks.filter((t) => t.completed).length;
  const totalCount = phase.tasks.length;

  const statusLabel =
    progress === 100
      ? 'Concluído'
      : progress > 0
      ? 'Em Andamento'
      : 'Pendente';

  const statusClass =
    progress === 100
      ? 'bg-badge-done text-badge-done-text'
      : progress > 0
      ? 'bg-badge-progress text-badge-progress-text'
      : 'bg-badge-pending text-badge-pending-text';

  return (
    <button className="flex flex-col bg-surface border border-border-light rounded-md p-md text-left w-full transition-all duration-200 ease-[ease] cursor-pointer hover:shadow-md hover:border-border" onClick={onClick} type="button">
      <div className="flex items-center gap-sm mb-md">
        <div className={`w-9 h-9 rounded-sm flex items-center justify-center shrink-0 ${progress === 100 ? 'bg-primary' : 'bg-primary-lighter border-[1.5px] border-primary'}`}>
          {progress === 100 ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <circle cx="12" cy="12" r="10" />
            </svg>
          )}
        </div>
        <h3 className="font-serif text-[1.1rem] font-semibold text-text-primary">
          {phase.number}. {phase.name}
        </h3>
      </div>

      <div className="flex flex-col gap-xs">
        <div className="flex justify-between items-center">
          <span className="text-[0.8rem] text-text-muted">{progress}%</span>
          <span className={`text-[0.7rem] px-[10px] py-[2px] rounded-[20px] font-medium ${statusClass}`}>{statusLabel}</span>
        </div>
        <div className="w-full h-1 bg-progress-track rounded-[2px] overflow-hidden">
          <div
            className="h-full bg-primary rounded-[2px] transition-[width] duration-[400ms] ease-[ease]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[0.75rem] text-text-muted">
          {completedCount}/{totalCount} tarefas
        </span>
      </div>
    </button>
  );
}

export default PhaseCard;
