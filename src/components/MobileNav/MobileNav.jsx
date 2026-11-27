import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Heart, BookOpen, ClipboardList, CalendarDays, Wallet,
  Users, UserCheck, Home, Plane, Store, PartyPopper, Settings,
  Menu, X, LogOut, Upload, Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const publicNavItems = [
  { path: '/', label: 'Início', icon: LayoutDashboard },
  { path: '/casamento', label: 'Nosso Casamento', icon: Heart },
  { path: '/nossa-historia', label: 'Nossa História', icon: BookOpen },
];

const privateNavItems = [
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

const itemBase = 'flex items-center gap-sm px-[12px] py-[10px] rounded-sm text-[0.875rem] text-text-secondary transition-all duration-200 ease-[ease] w-full text-left bg-transparent border-none cursor-pointer font-[inherit]';

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

  const navItems = isAuthenticated ? [...publicNavItems, ...privateNavItems] : publicNavItems;

  return (
    <div className="hidden max-nav:block fixed top-0 left-0 right-0 z-[200] bg-sidebar-bg shadow-md">
      <div className="flex items-center justify-between px-lg py-md">
        <div className="flex items-center gap-sm">
          <div className="relative w-8 h-8">
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-surface cursor-pointer">
              {couple.photoUrl ? (
                <img src={couple.photoUrl} alt={couple.photoDescription} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-surface-alt flex items-center justify-center text-text-muted rounded-full">
                  <Lock size={14} />
                </div>
              )}
            </div>
            {couple.photoUrl && isAuthenticated && (
              <button className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-danger text-white flex items-center justify-center p-0 border-none cursor-pointer" onClick={handleRemovePhoto} type="button">
                <X size={10} />
              </button>
            )}
            {isAuthenticated && (
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
            )}
          </div>
          <span className="font-serif text-[1.1rem] font-semibold text-text-primary">{couple.names}</span>
        </div>
        <button className="flex items-center justify-center w-9 h-9 rounded-sm text-text-primary bg-[rgba(255,255,255,0.4)] border-none cursor-pointer" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}>
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <nav className="px-md pb-md border-t border-[rgba(0,0,0,0.06)] max-h-[80vh] overflow-y-auto">
          <ul className="flex flex-col gap-[2px] pt-sm">
            {navItems.map((item) => {
              const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`${itemBase} hover:bg-[rgba(255,255,255,0.3)] ${isActive ? 'bg-sidebar-active text-text-primary font-medium' : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
            
            {!isAuthenticated && (
              <>
                <li className="px-md pt-md pb-sm text-[0.7rem] font-bold uppercase tracking-[1px] text-text-muted border-t border-[rgba(0,0,0,0.06)] mt-sm">
                  <span>Área Restrita</span>
                </li>
                <li>
                  <Link to="/login" className={`${itemBase} text-primary font-semibold bg-primary-lighter hover:bg-primary hover:text-white`} onClick={() => setIsOpen(false)}>
                    <Lock size={18} strokeWidth={1.8} />
                    <span>Entrar como noivos</span>
                  </Link>
                </li>
              </>
            )}

            {isAuthenticated && (
              <>
                <li>
                  <Link to="/configuracoes" className={`${itemBase} hover:bg-[rgba(255,255,255,0.3)] ${location.pathname === '/configuracoes' ? 'bg-sidebar-active text-text-primary font-medium' : ''}`} onClick={() => setIsOpen(false)}>
                    <Settings size={18} strokeWidth={1.8} />
                    <span>Configurações</span>
                  </Link>
                </li>
                
                <li>
                  <button className={`${itemBase} text-primary hover:bg-primary-lighter`} onClick={() => fileInputRef.current?.click()} type="button">
                    <Upload size={18} strokeWidth={1.8} />
                    <span>{couple.photoUrl ? 'Trocar foto' : 'Adicionar foto'}</span>
                  </button>
                </li>
                
                <li>
                  <button className={`${itemBase} text-danger border-t border-[rgba(0,0,0,0.06)] mt-sm pt-md hover:bg-badge-high`} onClick={() => { logout(); setIsOpen(false); }}>
                    <LogOut size={18} strokeWidth={1.8} />
                    <span>Sair</span>
                  </button>
                </li>
                
                <li>
                  <button className={`${itemBase} text-danger border-t border-[rgba(0,0,0,0.06)] mt-sm pt-md hover:bg-badge-high`} onClick={() => { onReset(); setIsOpen(false); }}>
                    <X size={18} strokeWidth={1.8} />
                    <span>Resetar dados</span>
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
}

export default MobileNav;
