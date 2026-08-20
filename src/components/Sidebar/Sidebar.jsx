import React, { useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Heart, BookOpen, ClipboardList, CalendarDays, Wallet,
  Users, UserCheck, Home, Plane, Store, PartyPopper, Settings,
  Upload, X, LogOut
} from 'lucide-react';
import ImagePlaceholder from '../ImagePlaceholder/ImagePlaceholder';
import { useAuth } from '../../context/AuthContext';
import './style.css';

const fullMenuGroups = [
  {
    title: '💍 NOSSO CASAMENTO',
    items: [
      { path: '/', label: 'Início', icon: LayoutDashboard },
      { path: '/casamento', label: 'Nosso Casamento', icon: Heart },
      { path: '/nossa-historia', label: 'Nossa História', icon: BookOpen },
    ]
  },
  {
    title: '📋 PLANEJAMENTO',
    items: [
      { path: '/planejamento', label: 'Planejamento', icon: ClipboardList },
      { path: '/cronograma', label: 'Cronograma', icon: CalendarDays },
      { path: '/financeiro', label: 'Financeiro', icon: Wallet },
    ]
  },
  {
    title: '👥 PESSOAS',
    items: [
      { path: '/convidados', label: 'Convidados', icon: Users },
      { path: '/padrinhos', label: 'Padrinhos', icon: UserCheck },
      { path: '/participantes', label: 'Participantes', icon: UserCheck },
    ]
  },
  {
    title: '🏠 NOSSA VIDA',
    items: [
      { path: '/casa', label: 'Nossa Casa', icon: Home },
      { path: '/lua-de-mel', label: 'Lua de Mel', icon: Plane },
    ]
  },
  {
    title: '🤝 ORGANIZAÇÃO',
    items: [
      { path: '/fornecedores', label: 'Fornecedores', icon: Store },
      { path: '/pos-casamento', label: 'Pós-Casamento', icon: PartyPopper },
    ]
  }
];

const restrictedMenuGroups = [
  {
    title: '💍 NOSSO CASAMENTO',
    items: [
      { path: '/', label: 'Início', icon: LayoutDashboard },
      { path: '/casamento', label: 'Nosso Casamento', icon: Heart },
      { path: '/nossa-historia', label: 'Nossa História', icon: BookOpen },
    ]
  }
];

function Sidebar({ couple, updateData, onReset }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const fileInputRef = useRef(null);

  const menuGroups = isAuthenticated ? fullMenuGroups : restrictedMenuGroups;

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
    <aside className="sidebar" id="main-navigation">
      <div className="sidebar-header">
        <div className="sidebar-photo-wrapper">
          <div className="sidebar-photo">
            {couple.photoUrl ? (
              <img src={couple.photoUrl} alt={couple.photoDescription} />
            ) : (
              <ImagePlaceholder description={couple.photoDescription} className="sidebar-photo-placeholder" />
            )}
          </div>
          {couple.photoUrl && (
            <div className="sidebar-photo-overlay">
              <button className="sidebar-photo-btn sidebar-photo-btn-remove" onClick={handleRemovePhoto} type="button">
                <X size={12} />
              </button>
              <button className="sidebar-photo-btn sidebar-photo-btn-change" onClick={() => fileInputRef.current?.click()} type="button">
                <Upload size={12} />
              </button>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
        </div>
        {!couple.photoUrl && (
          <button className="sidebar-photo-upload-btn" onClick={() => fileInputRef.current?.click()} type="button">
            <Upload size={12} /><span>Adicionar foto</span>
          </button>
        )}
        <h1 className="sidebar-couple-name">{couple.names}</h1>
        <p className="sidebar-couple-subtitle">{couple.subtitle}</p>
      </div>

      <nav className="sidebar-nav">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="sidebar-group">
            <span className="sidebar-group-title">{group.title}</span>
            <ul>
              {group.items.map((item) => {
                const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link to={item.path} className={`sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''}`}>
                      <Icon size={16} strokeWidth={1.8} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        {isAuthenticated && (
          <Link to="/configuracoes" className={`sidebar-nav-item ${location.pathname === '/configuracoes' ? 'sidebar-nav-item-active' : ''}`}>
            <Settings size={16} strokeWidth={1.8} />
            <span>Configurações</span>
          </Link>
        )}
        {isAuthenticated ? (
          <button className="sidebar-auth-btn sidebar-auth-logged" onClick={logout} type="button">
            <LogOut size={16} /><span>Sair</span>
          </button>
        ) : (
          <button className="sidebar-auth-btn sidebar-auth-guest" onClick={() => navigate('/login')} type="button">
            <LogOut size={16} /><span>Entrar</span>
          </button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;