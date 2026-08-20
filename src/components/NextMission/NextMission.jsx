import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

function NextMission({ phases, weddingDate }) {
  const navigate = useNavigate();

  return (
    <div className="next-mission" id="next-mission">
      <div className="next-mission-badges">
        <span className="next-mission-badge next-mission-badge-high">Prioridade Alta</span>
        <span className="next-mission-badge next-mission-badge-pending">Pendente</span>
      </div>

      <div className="next-mission-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.15">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>

      <h3 className="next-mission-title">Definir o local da cerimônia</h3>

      <div className="next-mission-deadline">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>Prazo: 30/09/2026</span>
      </div>

      <button
        className="next-mission-btn"
        onClick={() => navigate('/planejamento')}
      >
        Continuar planejamento
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </div>
  );
}

export default NextMission;