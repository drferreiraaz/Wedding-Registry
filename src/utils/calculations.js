export function calculatePhaseProgress(phase) {
  if (!phase.tasks || phase.tasks.length === 0) return 0;
  const totalWeight = phase.tasks.reduce((sum, t) => sum + (t.weight || 1), 0);
  const completedWeight = phase.tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + (t.weight || 1), 0);
  if (totalWeight === 0) return 0;
  return Math.round((completedWeight / totalWeight) * 100);
}

export function calculateOverallProgress(phases) {
  if (!phases || phases.length === 0) return 0;
  const totalWeight = phases.reduce(
    (sum, phase) =>
      sum + phase.tasks.reduce((s, t) => s + (t.weight || 1), 0),
    0
  );
  const completedWeight = phases.reduce(
    (sum, phase) =>
      sum +
      phase.tasks
        .filter((t) => t.completed)
        .reduce((s, t) => s + (t.weight || 1), 0),
    0
  );
  if (totalWeight === 0) return 0;
  return Math.round((completedWeight / totalWeight) * 100);
}

export function getCompletedTasks(phases) {
  return phases.reduce(
    (sum, phase) => sum + phase.tasks.filter((t) => t.completed).length,
    0
  );
}

export function getTotalTasks(phases) {
  return phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
}

export function getPendingTasks(phases) {
  return phases.reduce(
    (sum, phase) => sum + phase.tasks.filter((t) => !t.completed).length,
    0
  );
}

export function calculateDaysUntil(dateString) {
  const weddingDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  weddingDate.setHours(0, 0, 0, 0);
  const diff = weddingDate - today;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
}

export function calculateTotalExpenses(expenses) {
  return expenses.reduce((sum, exp) => sum + (exp.value || 0), 0);
}

export function calculateHomeProgress(items) {
  if (!items || items.length === 0) return 0;
  const completed = items.filter((item) => item.purchased).length;
  return Math.round((completed / items.length) * 100);
}

export function calculateHoneymoonProgress(items) {
  if (!items || items.length === 0) return 0;
  const completed = items.filter((item) => item.completed).length;
  return Math.round((completed / items.length) * 100);
}

export function calculatePostWeddingProgress(tasks) {
  if (!tasks || tasks.length === 0) return 0;
  const totalWeight = tasks.reduce((sum, t) => sum + (t.weight || 1), 0);
  const completedWeight = tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + (t.weight || 1), 0);
  if (totalWeight === 0) return 0;
  return Math.round((completedWeight / totalWeight) * 100);
}

export function getGuestStats(guests) {
  const total = guests.length;
  const confirmed = guests.filter((g) => g.rsvp === 'Confirmado').length;
  const pending = guests.filter((g) => g.rsvp === 'Pendente').length;
  const declined = guests.filter((g) => g.rsvp === 'Recusou').length;
  return { total, confirmed, pending, declined };
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('pt-BR');
}

export function getNextMission(phases) {
  for (const phase of phases) {
    const pendingTask = phase.tasks.find((t) => !t.completed);
    if (pendingTask) {
      return {
        phase: phase.name,
        task: pendingTask,
        deadline: pendingTask.deadline,
      };
    }
  }
  return null;
}