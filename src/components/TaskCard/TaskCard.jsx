import React from 'react';
import { Calendar, Users, CheckCircle } from 'lucide-react';
import './style.css';

function TaskCard({ task, onToggle, onEdit }) {
  return (
    <div className={`task-card ${task.completed ? 'task-card-completed' : ''}`}>
      <button
        className="task-card-checkbox"
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? 'Desmarcar tarefa' : 'Marcar tarefa como concluída'}
      >
        {task.completed ? (
          <CheckCircle size={20} className="task-card-checkbox-icon task-card-checkbox-icon-done" />
        ) : (
          <div className="task-card-checkbox-icon task-card-checkbox-icon-empty" />
        )}
      </button>

      <div className="task-card-content">
        <h4 className={`task-card-title ${task.completed ? 'task-card-title-completed' : ''}`}>
          {task.title}
        </h4>
        <div className="task-card-meta">
          {task.deadline && (
            <span className="task-card-meta-item">
              <Calendar size={13} />
              {new Date(task.deadline + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </span>
          )}
          {task.responsible && (
            <span className="task-card-meta-item">
              <Users size={13} />
              {task.responsible}
            </span>
          )}
        </div>
      </div>

      {onEdit && (
        <button className="task-card-actions" onClick={() => onEdit(task)} aria-label="Editar tarefa">
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