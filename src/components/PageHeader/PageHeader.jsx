import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { calculateOverallProgress, getTotalTasks, getCompletedTasks } from '../../utils/calculations';
import './style.css';

function PageHeader({ title, subtitle, showProgress = true }) {
  const { data } = useOutletContext();
  const overallProgress = calculateOverallProgress(data.phases);
  const totalTasks = getTotalTasks(data.phases);
  const completedTasks = getCompletedTasks(data.phases);

  return (
    <div className="page-header">
      <div className="page-header-top">
        <span className="page-header-tag">DO 0% AO 100%</span>
        <h1 className="page-header-title">{title}</h1>
      </div>

      {showProgress && (
        <div className="page-header-progress">
          <div className="page-header-progress-info">
            <span className="page-header-progress-label">Progresso Geral</span>
            <span className="page-header-progress-value">{overallProgress}%</span>
          </div>
          <div className="page-header-progress-track">
            <div
              className="page-header-progress-fill"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <span className="page-header-progress-tasks">
            {completedTasks} de {totalTasks} tarefas
          </span>
        </div>
      )}

      {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
    </div>
  );
}

export default PageHeader;