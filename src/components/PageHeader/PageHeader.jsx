import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { calculateOverallProgress, getTotalTasks, getCompletedTasks } from '../../utils/calculations';

function PageHeader({ title, subtitle, showProgress = true }) {
  const { data } = useOutletContext();
  const overallProgress = calculateOverallProgress(data.phases);
  const totalTasks = getTotalTasks(data.phases);
  const completedTasks = getCompletedTasks(data.phases);

  return (
    <div className="mb-xl">
      <div className="mb-lg">
        <span className="page-header-tag">DO 0% AO 100%</span>
        <h1 className="font-serif text-[2.2rem] font-bold text-text-primary mb-xs">{title}</h1>
      </div>

      {showProgress && (
        <div className="bg-surface border border-border-light rounded-md p-lg mb-xl">
          <div className="flex justify-between items-center mb-sm">
            <span className="text-[0.85rem] text-text-secondary">Progresso Geral</span>
            <span className="font-serif text-[1.3rem] font-semibold text-primary">{overallProgress}%</span>
          </div>
          <div className="w-full h-[6px] bg-progress-track rounded-[3px] overflow-hidden mb-sm">
            <div
              className="h-full bg-primary rounded-[3px] transition-[width] duration-[600ms] ease-[ease]"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <span className="text-[0.8rem] text-text-muted text-right block">
            {completedTasks} de {totalTasks} tarefas
          </span>
        </div>
      )}

      {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
    </div>
  );
}

export default PageHeader;
