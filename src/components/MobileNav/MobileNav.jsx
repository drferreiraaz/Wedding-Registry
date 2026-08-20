import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Heart, BookOpen, ClipboardList, CalendarDays, Wallet,
  Users, UserCheck, Home, Plane, Store, PartyPopper, Settings,
  Menu, X, LogOut, Upload
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './style.css';

const navItems = [
  { path: '/', label: 'Início', icon: LayoutDashboard },
  { path: '/casamento', label: 'Nosso Casamento', icon: Heart },
  { path: '/nossa-historia', label: 'Nossa História', icon: BookOpen },
  { path: '/planejamento', label: 'Planejamento', icon: ClipboardList },
  { path: '/cronograma', label: 'Cronograma', icon: CalendarDays },
  { path: '/financeiro', label: 'Financeiro', icon: Wallet },
  { path: '/convidados', label: 'Convidados', icon: Users },
  { path: '/padrinhos', label: 'Padrinhos', icon: UserCheck },
  { path: '/participantes', label: 'Participantes', icon: UserCheck },
  { path: '/casa', label: 'Nossa Casa', icon: Home },
  { path: '/lua-de-mel', label: 'Lua de Mel', icon: Plane },
  { path: '/fornecedores', label: 'Fornecedores', icon: Store },
  { path: '/pos-casamento', label: 'Pós-Casamento', icon: PartyPopper },
];

function MobileNav({ couple, onReset, updateData }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
      alert('Selecione uma imagem válida de até 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => updateData(prev => ({ ...prev, couple: { ...prev.couple, photoUrl: event.target.result } }));
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    if (window.confirm('Remover a foto do casal?')) {
      updateData(prev => ({ ...prev, couple: { ...prev.couple, photoUrl: null } }));
    }
  };

  return (
    <div className={`mobile-nav ${isOpen ? 'mobile-open' : ''}`}>
      <div className="mobile-nav-header">
        <div className="mobile-nav-brand">
          <div className="mobile-nav-photo-wrapper">
            <div className="mobile-nav-photo">
              {couple.photoUrl ? (
                <img src={couple.photoUrl} alt={couple.photoDescription} />
              ) : (
                <div className="mobile-nav-photo-empty" onClick={() => fileInputRef.current?.click()}>
                  <Upload size={14} />
                </div>
              )}
            </div>
            {couple.photoUrl && (
              <button className="mobile-nav-photo-remove" onClick={handleRemovePhoto} type="button">
                <X size={10} />
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
          </div>
          <span className="mobile-nav-couple-name">{couple.names}</span>
        </div>
        <button className="mobile-nav-toggle" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}>
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <nav className="mobile-nav-menu">
          <ul>
            {navItems.map((item) => {
              const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link to={item.path} className={`mobile-nav-item ${isActive ? 'mobile-nav-item-active' : ''}`} onClick={() => setIsOpen(false)}>
                    <Icon size={18} strokeWidth={1.8} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
            
            {isAuthenticated && (
              <li>
                <Link to="/configuracoes" className={`mobile-nav-item ${location.pathname === '/configuracoes' ? 'mobile-nav-item-active' : ''}`} onClick={() => setIsOpen(false)}>
                  <Settings size={18} strokeWidth={1.8} />
                  <span>Configurações</span>
                </Link>
              </li>
            )}

            <li>
              <button className="mobile-nav-item mobile-nav-photo-upload" onClick={() => fileInputRef.current?.click()} type="button">
                <Upload size={18} strokeWidth={1.8} />
                <span>{couple.photoUrl ? 'Trocar foto' : 'Adicionar foto'}</span>
              </button>
            </li>
            
            <li>
              {isAuthenticated ? (
                <button className="mobile-nav-item mobile-nav-reset" onClick={() => { logout(); setIsOpen(false); }}>
                  <LogOut size={18} strokeWidth={1.8} />
                  <span>Sair</span>
                </button>
              ) : (
                <button className="mobile-nav-item mobile-nav-login" onClick={() => { window.location.href = '/login'; setIsOpen(false); }}>
                  <LogOut size={18} strokeWidth={1.8} />
                  <span>Entrar</span>
                </button>
              )}
            </li>
            
            {isAuthenticated && (
              <li>
                <button className="mobile-nav-item mobile-nav-reset" onClick={() => { onReset(); setIsOpen(false); }}>
                  <X size={18} strokeWidth={1.8} />
                  <span>Resetar dados</span>
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
}

export default MobileNav;