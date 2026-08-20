const STORAGE_KEY = 'davi-nicolly-wedding';

export function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Erro ao carregar dados:', e);
  }
  return null;
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Erro ao salvar dados:', e);
  }
}

export function clearData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Erro ao limpar dados:', e);
  }
}