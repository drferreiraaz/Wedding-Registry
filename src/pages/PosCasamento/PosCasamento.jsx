import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import { calculatePostWeddingProgress } from '../../utils/calculations';
import { CheckCircle, Circle, Heart } from 'lucide-react';

function PosCasamento() {
  const { data, updateData } = useOutletContext();
  const { isAuthenticated } = useAuth();
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
    <div className="p-xl max-w-[800px] max-mobile:p-md" id="post-wedding">
      <PageHeader title="Pós-Casamento" subtitle="Os últimos passos da nossa jornada" showProgress={false} />

      {allDone ? (
        <div className="flex flex-col items-center justify-center text-center py-3xl px-xl bg-surface border border-border-light rounded-lg">
          <div className="mb-lg animate-[pulse-heart_2s_ease-in-out_infinite]">
            <Heart size={48} fill="var(--color-primary)" color="var(--color-primary)" />
          </div>
          <h2 className="font-serif text-[3rem] font-bold text-primary mb-sm max-mobile:text-[2.5rem]">100%</h2>
          <h3 className="font-serif text-[1.5rem] font-semibold text-text-primary mb-md">Davi & Nicolly</h3>
          <p className="font-serif text-[1.3rem] text-text-primary mb-xs">Conseguimos.</p>
          <p className="text-[1rem] text-text-secondary italic">
            Agora começa a nossa vida juntos.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-surface border border-border-light rounded-md p-lg mb-xl">
            <div className="flex justify-between items-center mb-sm">
              <span className="text-[0.85rem] text-text-secondary">Progresso</span>
              <span className="font-serif text-[1.3rem] font-semibold text-primary">{postProgress}%</span>
            </div>
            <div className="w-full h-[6px] bg-progress-track rounded-[3px] overflow-hidden">
              <div className="h-full bg-primary rounded-[3px] transition-[width] duration-[400ms] ease-[ease]" style={{ width: `${postProgress}%` }} />
            </div>
          </div>

          <div className="bg-surface border border-border-light rounded-lg p-lg">
            <h2 className="font-serif text-[1.2rem] font-semibold text-text-primary mb-lg">Checklist final</h2>
            <div className="flex flex-col gap-sm">
              {data.postWedding.tasks.map((task) => (
                <div key={task.id} className={`flex items-center gap-md p-md bg-surface-alt border border-border-light rounded-md transition-all duration-200 ease-[ease] hover:border-border ${task.completed ? 'opacity-60' : ''}`}>
                  <button
                    className="shrink-0 bg-transparent border-none cursor-pointer p-0 flex items-center group"
                    onClick={() => isAuthenticated && toggleTask(task.id)}
                    disabled={!isAuthenticated}
                    aria-label={task.completed ? 'Desmarcar' : 'Marcar como feito'}
                  >
                    {task.completed ? (
                      <CheckCircle size={20} className="transition-all duration-200 ease-[ease] text-primary" />
                    ) : (
                      <Circle size={20} className="transition-all duration-200 ease-[ease] text-border group-hover:text-primary" />
                    )}
                  </button>
                  <div className="flex-1 flex items-center justify-between gap-md max-mobile:flex-col max-mobile:items-start">
                    <h3 className={`text-[0.95rem] font-medium ${task.completed ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                      {task.title}
                    </h3>
                    {task.responsible && (
                      <span className="text-[0.75rem] text-text-muted whitespace-nowrap">{task.responsible}</span>
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
