import './style.css';
import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Heart,
  ClipboardList,
  Wallet,
  Users,
  Store,
  CalendarDays,
  Home,
  Plane,
  PartyPopper,
  Plus,
  RotateCcw,
  Upload,
  X,
} from 'lucide-react';
import ImagePlaceholder from '../ImagePlaceholder/ImagePlaceholder';

const navItems = [
  { path: '/', label: 'Início', icon: LayoutDashboard },
  { path: '/casamento', label: 'Nosso Casamento', icon: Heart },
  { path: '/planejamento', label: 'Planejamento', icon: ClipboardList },
  { path: '/financeiro', label: 'Financeiro', icon: Wallet },
  { path: '/convidados', label: 'Convidados', icon: Users },
  { path: '/fornecedores', label: 'Fornecedores', icon: Store },
  { path: '/cronograma', label: 'Cronograma', icon: CalendarDays },
  { path: '/casa', label: 'Nossa Casa', icon: Home },
  { path: '/lua-de-mel', label: 'Lua de Mel', icon: Plane },
  { path: '/pos-casamento', label: 'Pós-Casamento', icon: PartyPopper },
];

function Sidebar({ couple, onAddTask, onReset, updateData }) {
  const location = useLocation();
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem é muito grande. O limite é 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      updateData((prev) => ({
        ...prev,
        couple: {
          ...prev.couple,
          photoUrl: event.target.result,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    if (window.confirm('Remover a foto do casal?')) {
      updateData((prev) => ({
        ...prev,
        couple: {
          ...prev.couple,
          photoUrl: null,
        },
      }));
    }
  };

  return (
    <aside className="sidebar" id="main-navigation">
      <div className="sidebar-header">
        <div className="sidebar-photo-wrapper">
          <div className="sidebar-photo">
            {couple.photoUrl ? (
              <img src={couple.photoUrl} alt={couple.photoDescription} />
            ) : (
              <ImagePlaceholder
                description={couple.photoDescription}
                className="sidebar-photo-placeholder"
              />
            )}
          </div>

          {couple.photoUrl && (
            <div className="sidebar-photo-overlay">
              <button
                className="sidebar-photo-btn sidebar-photo-btn-remove"
                onClick={handleRemovePhoto}
                title="Remover foto"
                type="button"
              >
                <X size={12} />
              </button>
              <button
                className="sidebar-photo-btn sidebar-photo-btn-change"
                onClick={() => fileInputRef.current?.click()}
                title="Trocar foto"
                type="button"
              >
                <Upload size={12} />
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: 'none' }}
            aria-label="Selecionar foto do casal"
          />
        </div>

        {!couple.photoUrl && (
          <button
            className="sidebar-photo-upload-btn"
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <Upload size={12} />
            <span>Adicionar foto</span>
          </button>
        )}

        <h1 className="sidebar-couple-name">{couple.names}</h1>
        <p className="sidebar-couple-subtitle">{couple.subtitle}</p>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''}`}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-add-btn" onClick={onAddTask}>
          <Plus size={16} />
          <span>Nova Tarefa</span>
        </button>
        <button className="sidebar-reset-btn" onClick={onReset} title="Resetar todos os dados">
          <RotateCcw size={14} />
          <span>Resetar</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;