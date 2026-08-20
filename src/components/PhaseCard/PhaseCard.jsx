import React from 'react';
import { calculatePhaseProgress } from '../../utils/calculations';
import './style.css';

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
      ? 'phase-card-status-done'
      : progress > 0
      ? 'phase-card-status-progress'
      : 'phase-card-status-pending';

  return (
    <button className="phase-card" onClick={onClick} type="button">
      <div className="phase-card-header">
        <div className="phase-card-icon">
          {progress === 100 ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
            </svg>
          )}
        </div>
        <h3 className="phase-card-title">
          {phase.number}. {phase.name}
        </h3>
      </div>

      <div className="phase-card-body">
        <div className="phase-card-progress-info">
          <span className="phase-card-progress-value">{progress}%</span>
          <span className={`phase-card-status ${statusClass}`}>{statusLabel}</span>
        </div>
        <div className="phase-card-progress-bar">
          <div
            className="phase-card-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="phase-card-task-count">
          {completedCount}/{totalCount} tarefas
        </span>
      </div>
    </button>
  );
}

export default PhaseCard;