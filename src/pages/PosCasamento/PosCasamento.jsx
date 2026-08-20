import React from 'react';
import { useOutletContext } from 'react-router-dom';
import PageHeader from '../../components/PageHeader/PageHeader';
import { calculatePostWeddingProgress } from '../../utils/calculations';
import { CheckCircle, Circle, Heart } from 'lucide-react';
import './style.css';

function PosCasamento() {
  const { data, updateData } = useOutletContext();
  const postProgress = calculatePostWeddingProgress(data.postWedding.tasks);
  const allDone = postProgress === 100;

  const toggleTask = (taskId) => {
    updateData((prev) => ({
      ...prev,
      postWedding: {
        ...prev.postWedding,
        tasks: prev.postWedding.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        ),
      },
    }));
  };

  return (
    <div className="post-wedding" id="post-wedding">
      <PageHeader title="Pós-Casamento" subtitle="Os últimos passos da nossa jornada" showProgress={false} />

      {allDone ? (
        <div className="post-wedding-complete">
          <div className="post-wedding-complete-icon">
            <Heart size={48} fill="var(--color-primary)" color="var(--color-primary)" />
          </div>
          <h2 className="post-wedding-complete-title">100%</h2>
          <h3 className="post-wedding-complete-names">Davi & Nicolly</h3>
          <p className="post-wedding-complete-message">Conseguimos.</p>
          <p className="post-wedding-complete-submessage">
            Agora começa a nossa vida juntos.
          </p>
        </div>
      ) : (
        <>
          <div className="post-wedding-progress-section">
            <div className="post-wedding-progress-header">
              <span className="post-wedding-progress-label">Progresso</span>
              <span className="post-wedding-progress-value">{postProgress}%</span>
            </div>
            <div className="post-wedding-progress-track">
              <div className="post-wedding-progress-fill" style={{ width: `${postProgress}%` }} />
            </div>
          </div>

          <div className="post-wedding-content">
            <h2 className="post-wedding-section-title">Checklist final</h2>
            <div className="post-wedding-list">
              {data.postWedding.tasks.map((task) => (
                <div key={task.id} className={`post-wedding-task ${task.completed ? 'post-wedding-task-done' : ''}`}>
                  <button
                    className="post-wedding-task-check"
                    onClick={() => toggleTask(task.id)}
                    aria-label={task.completed ? 'Desmarcar' : 'Marcar como feito'}
                  >
                    {task.completed ? (
                      <CheckCircle size={20} className="post-wedding-task-check-icon post-wedding-task-check-done" />
                    ) : (
                      <Circle size={20} className="post-wedding-task-check-icon post-wedding-task-check-empty" />
                    )}
                  </button>
                  <div className="post-wedding-task-content">
                    <h3 className={`post-wedding-task-title ${task.completed ? 'post-wedding-task-title-done' : ''}`}>
                      {task.title}
                    </h3>
                    {task.responsible && (
                      <span className="post-wedding-task-responsible">{task.responsible}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PosCasamento;