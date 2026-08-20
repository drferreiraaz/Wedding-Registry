import React from 'react';
import { Wallet, Users, Calendar, Heart } from 'lucide-react';
import StatCard from '../StatCard/StatCard';
import { formatCurrency, calculateDaysUntil } from '../../utils/calculations';
import './style.css';

function StatsGrid({ finances, guests, weddingDate, expenses }) {
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.value || 0), 0);
  const daysUntil = calculateDaysUntil(weddingDate);

  return (
    <div className="stats-grid" id="stats-grid">
      <StatCard
        icon={<Wallet size={20} />}
        label="Financeiro"
        value={formatCurrency(totalExpenses)}
        unit="Gastos"
      />
      <StatCard
        icon={<Users size={20} />}
        label="Convidados"
        value={guests.length}
        unit="cadastrados"
      />
      <StatCard
        icon={<Calendar size={20} />}
        label="Casamento"
        value={new Date(weddingDate + 'T00:00:00').toLocaleDateString('pt-BR')}
      />
      <StatCard
        icon={<Heart size={20} />}
        label="Contagem"
        value={daysUntil}
        unit="dias"
      />
    </div>
  );
}

export default StatsGrid;