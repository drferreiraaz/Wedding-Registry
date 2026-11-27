import React from 'react';
import { Calendar, Users, CheckCircle } from 'lucide-react';

function TaskCard({ task, onToggle, onEdit, readOnly = false }) {
  return (
    <div className={`flex items-start gap-sm p-md bg-surface border border-border-light rounded-md transition-all duration-200 ease-[ease] hover:border-border ${task.completed ? 'opacity-60' : ''}`}>
      <button
        className="shrink-0 mt-[2px] bg-transparent border-none cursor-pointer p-0"
        onClick={() => onToggle(task.id)}
        disabled={readOnly}
        aria-label={task.completed ? 'Desmarcar tarefa' : 'Marcar tarefa como concluída'}
      >
        {task.completed ? (
          <CheckCircle size={22} className="text-primary block" />
        ) : (
          <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center border-2 border-border transition-all duration-200 ease-[ease] hover:border-primary" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <h4 className={`font-sans text-[0.95rem] font-medium mb-[4px] leading-[1.4] ${task.completed ? 'line-through text-text-muted' : 'text-text-primary'}`}>
          {task.title}
        </h4>
        <div className="flex flex-wrap gap-sm">
          {task.deadline && (
            <span className="flex items-center gap-[4px] text-[0.75rem] text-text-muted">
              <Calendar size={13} className="opacity-60" />
              {new Date(task.deadline + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </span>
          )}
          {task.responsible && (
            <span className="flex items-center gap-[4px] text-[0.75rem] text-text-muted">
              <Users size={13} className="opacity-60" />
              {task.responsible}
            </span>
          )}
        </div>
      </div>

      {onEdit && !readOnly && (
        <button className="shrink-0 p-[4px] text-text-muted rounded-sm transition-colors duration-200 ease-[ease] hover:text-text-primary" onClick={() => onEdit(task)} aria-label="Editar tarefa">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default TaskCard;
