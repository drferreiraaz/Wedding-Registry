import './style.css';
import React, { useState, useRef } from 'react';
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
  Menu,
  X,
  RotateCcw,
  Upload,
} from 'lucide-react';

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

function MobileNav({ couple, onReset, updateData }) {
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="mobile-nav">
      <div className="mobile-nav-header">
        <div className="mobile-nav-brand">
          <div className="mobile-nav-photo-wrapper">
            <div className="mobile-nav-photo">
              {couple.photoUrl ? (
                <img src={couple.photoUrl} alt={couple.photoDescription} />
              ) : (
                <div className="mobile-nav-photo-empty">
                  <Upload size={14} />
                </div>
              )}
            </div>
            {couple.photoUrl && (
              <button
                className="mobile-nav-photo-remove"
                onClick={handleRemovePhoto}
                type="button"
                aria-label="Remover foto"
              >
                <X size={10} />
              </button>
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
          <span className="mobile-nav-couple-name">{couple.names}</span>
        </div>
        <button
          className="mobile-nav-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <nav className="mobile-nav-menu">
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
                    className={`mobile-nav-item ${isActive ? 'mobile-nav-item-active' : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                className="mobile-nav-item mobile-nav-photo-upload"
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                <Upload size={18} strokeWidth={1.8} />
                <span>{couple.photoUrl ? 'Trocar foto' : 'Adicionar foto'}</span>
              </button>
            </li>
            <li>
              <button
                className="mobile-nav-item mobile-nav-reset"
                onClick={() => {
                  onReset();
                  setIsOpen(false);
                }}
              >
                <RotateCcw size={18} strokeWidth={1.8} />
                <span>Resetar dados</span>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default MobileNav;