import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import Modal from '../../components/Modal/Modal';
import { CheckCircle, Circle, Plus, Trash2, Edit3 } from 'lucide-react';

function Cronograma() {
  const { data, updateData } = useOutletContext();
  const { isAuthenticated } = useAuth();
  const [expandedItem, setExpandedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [currentTimelineId, setCurrentTimelineId] = useState(null);

  const [formData, setFormData] = useState({
    label: '',
    date: '',
    tasks: [],
  });

  const [taskFormData, setTaskFormData] = useState({
    text: '',
  });

  const toggleTaskInItem = (timelineId, taskIndex) => {
    const key = `${timelineId}-${taskIndex}`;
    updateData((prev) => ({
      ...prev,
      timeline: prev.timeline.map((item) => {
        if (item.id !== timelineId) return item;
        const completedTasks = item.completedTasks || [];
        const hasKey = completedTasks.includes(key);
        return {
          ...item,
          completedTasks: hasKey
            ? completedTasks.filter((k) => k !== key)
            : [...completedTasks, key],
        };
      }),
    }));
  };

  const openNewItem = () => {
    setEditingItem(null);
    setFormData({ label: '', date: '', tasks: [] });
    setModalOpen(true);
  };

  const openEditItem = (item) => {
    setEditingItem(item);
    setFormData({ label: item.label, date: item.date, tasks: item.tasks });
    setModalOpen(true);
  };

  const handleSaveItem = () => {
    if (!formData.label.trim()) return;

    updateData((prev) => {
      if (editingItem) {
        return {
          ...prev,
          timeline: prev.timeline.map((i) =>
            i.id === editingItem.id ? { ...i, ...formData } : i
          ),
        };
      }
      return {
        ...prev,
        timeline: [
          ...prev.timeline,
          { id: `tl-${Date.now()}`, ...formData, completedTasks: [] },
        ],
      };
    });
    setModalOpen(false);
  };

  const handleDeleteItem = (id) => {
    updateData((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((i) => i.id !== id),
    }));
  };

  const openNewTask = (timelineId) => {
    setCurrentTimelineId(timelineId);
    setEditingTask(null);
    setTaskFormData({ text: '' });
    setTaskModalOpen(true);
  };

  const openEditTask = (timelineId, taskIndex) => {
    const item = data.timeline.find((i) => i.id === timelineId);
    if (!item) return;
    setCurrentTimelineId(timelineId);
    setEditingTask({ index: taskIndex, text: item.tasks[taskIndex] });
    setTaskFormData({ text: item.tasks[taskIndex] });
    setTaskModalOpen(true);
  };

  const handleSaveTask = () => {
    if (!taskFormData.text.trim()) return;

    updateData((prev) => ({
      ...prev,
      timeline: prev.timeline.map((item) => {
        if (item.id !== currentTimelineId) return item;
        const newTasks = [...item.tasks];
        if (editingTask !== null) {
          newTasks[editingTask.index] = taskFormData.text;
        } else {
          newTasks.push(taskFormData.text);
        }
        return { ...item, tasks: newTasks };
      }),
    }));
    setTaskModalOpen(false);
  };

  const handleDeleteTask = (timelineId, taskIndex) => {
    updateData((prev) => ({
      ...prev,
      timeline: prev.timeline.map((item) => {
        if (item.id !== timelineId) return item;
        const newTasks = item.tasks.filter((_, i) => i !== taskIndex);
        const key = `${timelineId}-${taskIndex}`;
        const completedTasks = (item.completedTasks || []).filter((k) => k !== key);
        return { ...item, tasks: newTasks, completedTasks };
      }),
    }));
  };

  return (
    <div className="p-xl max-w-[800px] max-mobile:p-md" id="timeline">
      <PageHeader title="Cronograma" subtitle="Linha do tempo do planejamento" />

      {isAuthenticated && (
        <div className="flex justify-end mb-lg">
          <button className="flex items-center gap-sm px-md py-sm bg-primary text-white rounded-sm text-[0.85rem] font-medium transition-colors duration-200 ease-[ease] hover:bg-primary-hover" onClick={openNewItem}>
            <Plus size={16} />
            <span>Novo Marco</span>
          </button>
        </div>
      )}

      <div className="relative pl-lg">
        <div className="absolute left-[7px] top-[20px] bottom-[20px] w-[2px] bg-border-light" aria-hidden="true" />
        {data.timeline.length === 0 ? (
          <div className="text-center p-3xl text-text-muted">
            <p className="text-[1rem] mb-sm">Nenhum marco no cronograma ainda.</p>
            <p className="text-[0.85rem] italic">Adicione marcos como "12 meses antes", "6 meses antes", etc.</p>
          </div>
        ) : (
          data.timeline.map((item) => {
            const completedTasks = item.completedTasks || [];
            const completedCount = completedTasks.length;
            const totalCount = item.tasks.length;
            const isExpanded = expandedItem === item.id;

            return (
              <div key={item.id} className="relative mb-md">
                <div className="absolute -left-[20px] top-[24px] w-3 h-3 rounded-full bg-primary border-2 border-background z-[1]" />

                <div className="bg-surface border border-border-light rounded-md overflow-hidden">
                  <button
                    className="flex items-center justify-between px-lg py-md w-full text-left bg-transparent border-none cursor-pointer transition-colors duration-200 ease-[ease] hover:bg-surface-alt"
                    onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                    aria-expanded={isExpanded}
                  >
                    <div className="flex flex-col gap-[2px]">
                      <span className="text-[0.75rem] text-text-muted font-medium">{item.label}</span>
                      <h3 className="font-serif text-[1.1rem] font-semibold text-text-primary">
                        {item.date ? new Date(item.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Sem data'}
                      </h3>
                    </div>
                    <div className="text-[0.8rem] text-text-muted">
                      <span className="bg-surface-alt px-[10px] py-[2px] rounded-[20px] text-[0.75rem]">
                        {completedCount}/{totalCount}
                      </span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="flex flex-col gap-sm px-lg pb-md pt-md border-t border-border-light">
                      {isAuthenticated && (
                        <div className="flex gap-[4px] mb-sm pb-sm border-b border-border-light">
                          <button className="flex items-center justify-center w-7 h-7 rounded-sm text-text-muted transition-all duration-200 ease-[ease] hover:bg-surface-alt hover:text-primary" onClick={() => openEditItem(item)}>
                            <Edit3 size={14} />
                          </button>
                          <button className="flex items-center justify-center w-7 h-7 rounded-sm text-text-muted transition-all duration-200 ease-[ease] hover:bg-badge-high hover:text-badge-high-text" onClick={() => handleDeleteItem(item.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}

                      {item.tasks.map((task, taskIndex) => {
                        const key = `${item.id}-${taskIndex}`;
                        const isDone = completedTasks.includes(key);
                        return (
                          <div key={key} className="group flex items-center gap-sm py-sm">
                            <button
                              className="shrink-0 bg-transparent border-none cursor-pointer p-0 flex items-center"
                              onClick={() => isAuthenticated && toggleTaskInItem(item.id, taskIndex)}
                              disabled={!isAuthenticated}
                              aria-label={isDone ? 'Desmarcar' : 'Marcar como feito'}
                            >
                              {isDone ? (
                                <CheckCircle size={18} className="transition-all duration-200 ease-[ease] text-primary" />
                              ) : (
                                <Circle size={18} className="transition-all duration-200 ease-[ease] text-border group-hover:text-primary" />
                              )}
                            </button>
                            <span className={`flex-1 text-[0.9rem] ${isDone ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                              {task}
                            </span>
                            {isAuthenticated && (
                              <div className="flex gap-[2px] opacity-0 transition-opacity duration-200 ease-[ease] group-hover:opacity-100">
                                <button className="flex items-center justify-center w-6 h-6 rounded-sm text-text-muted transition-all duration-200 ease-[ease] hover:bg-surface-alt hover:text-primary" onClick={() => openEditTask(item.id, taskIndex)}>
                                  <Edit3 size={12} />
                                </button>
                                <button className="flex items-center justify-center w-6 h-6 rounded-sm text-text-muted transition-all duration-200 ease-[ease] hover:bg-badge-high hover:text-badge-high-text" onClick={() => handleDeleteTask(item.id, taskIndex)}>
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {isAuthenticated && (
                        <button className="flex items-center gap-sm px-md py-sm mt-sm text-[0.8rem] text-text-muted rounded-sm transition-all duration-200 ease-[ease] hover:bg-surface-alt hover:text-primary" onClick={() => openNewTask(item.id)}>
                          <Plus size={14} />
                          <span>Adicionar tarefa</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Editar Marco' : 'Novo Marco'}
      >
        <div className="flex flex-col gap-md">
          <div className="form-group">
            <label className="form-label" htmlFor="tl-label">Label</label>
            <input
              id="tl-label"
              className="form-input"
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="Ex: 12 meses antes"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="tl-date">Data</label>
            <input
              id="tl-date"
              className="form-input"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="form-actions">
            <div />
            <div className="form-actions-right">
              <button className="form-btn form-btn-secondary" onClick={() => setModalOpen(false)}>
                Cancelar
              </button>
              <button className="form-btn form-btn-primary" onClick={handleSaveItem}>
                {editingItem ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        title={editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
      >
        <div className="flex flex-col gap-md">
          <div className="form-group">
            <label className="form-label" htmlFor="task-text">Tarefa</label>
            <input
              id="task-text"
              className="form-input"
              type="text"
              value={taskFormData.text}
              onChange={(e) => setTaskFormData({ ...taskFormData, text: e.target.value })}
              placeholder="Descreva a tarefa..."
            />
          </div>

          <div className="form-actions">
            <div />
            <div className="form-actions-right">
              <button className="form-btn form-btn-secondary" onClick={() => setTaskModalOpen(false)}>
                Cancelar
              </button>
              <button className="form-btn form-btn-primary" onClick={handleSaveTask}>
                {editingTask ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Cronograma;
