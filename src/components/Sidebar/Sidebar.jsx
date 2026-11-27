import React, { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Heart, BookOpen, ClipboardList, CalendarDays, Wallet,
  Users, UserCheck, Home, Plane, Store, PartyPopper, Settings,
  Upload, X, LogOut, Loader2
} from 'lucide-react';
import ImagePlaceholder from '../ImagePlaceholder/ImagePlaceholder';
import { useAuth } from '../../context/AuthContext';
import { uploadImage } from '../../services/cloudinary';

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

const navItemBase = 'flex items-center gap-sm px-[12px] py-sm rounded-sm text-[0.85rem] transition-all duration-200 ease-[ease] border-l-[3px]';

function Sidebar({ couple, updateData, onReset }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const menuGroups = isAuthenticated ? fullMenuGroups : restrictedMenuGroups;

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      alert('Selecione uma imagem válida de até 5MB.');
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadImage(file);
      updateData(prev => ({ 
        ...prev, 
        couple: { ...prev.couple, photoUrl: result.url } 
      }));
    } catch (error) {
      console.error('Erro no upload da foto do casal:', error);
      alert('Erro ao fazer upload da imagem. Tente novamente.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = () => {
    if (window.confirm('Remover a foto do casal?')) {
      updateData(prev => ({ ...prev, couple: { ...prev.couple, photoUrl: null } }));
    }
  };

  const navItemClass = (isActive) =>
    `${navItemBase} ${isActive
      ? 'bg-sidebar-active text-text-primary font-medium border-l-primary'
      : 'text-text-secondary border-l-transparent hover:bg-[rgba(255,255,255,0.3)] hover:text-text-primary'}`;

  return (
    <aside id="main-navigation" className="sidebar-scrollbar fixed top-0 left-0 z-[100] w-[260px] h-screen max-h-screen flex flex-col bg-sidebar-bg p-lg overflow-y-auto overflow-x-hidden transition-transform duration-300 ease-[ease] max-nav:-translate-x-full">
      <div className="flex flex-col items-center text-center pb-lg border-b border-[rgba(0,0,0,0.06)] mb-md shrink-0">
        <div className="group relative w-20 h-20 mb-sm">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-[3px] border-surface shadow-sm cursor-pointer transition-shadow duration-200 ease-[ease] hover:shadow-md">
            {couple.photoUrl ? (
              <img src={couple.photoUrl} alt={couple.photoDescription} className="w-full h-full object-cover block" />
            ) : (
              <ImagePlaceholder description={couple.photoDescription} className="w-full h-full" />
            )}

            {/* Overlay de Loading */}
            {isUploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-full">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}

            {/* Overlay de Ações (só aparece se não estiver carregando) */}
            {couple.photoUrl && (
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-xs p-xs bg-[linear-gradient(transparent,rgba(0,0,0,0.6))] rounded-full transition-opacity duration-200 ease-[ease] ${isUploading ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'}`}>
                <button className="flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(255,255,255,0.95)] text-text-primary transition-all duration-200 ease-[ease] hover:bg-white hover:scale-110 hover:text-danger" onClick={handleRemovePhoto} type="button">
                  <X size={12} />
                </button>
                <button className="flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(255,255,255,0.95)] text-text-primary transition-all duration-200 ease-[ease] hover:bg-white hover:scale-110 hover:text-primary" onClick={() => fileInputRef.current?.click()} type="button">
                  <Upload size={12} />
                </button>
              </div>
            )}
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={isUploading} />
        </div>
        {!couple.photoUrl && (
          <button 
            className={`flex items-center justify-center gap-xs px-[10px] py-xs bg-primary text-white rounded-sm text-[0.7rem] font-medium mb-sm transition-colors duration-200 ease-[ease] border-none cursor-pointer hover:bg-primary-hover ${isUploading ? 'opacity-50 pointer-events-none' : ''}`} 
            onClick={() => fileInputRef.current?.click()} 
            type="button"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Upload size={12} /><span>Adicionar foto</span>
              </>
            )}
          </button>
        )}
        <h1 className="font-serif text-[1.25rem] font-semibold text-text-primary mb-[2px]">{couple.names}</h1>
        <p className="text-[0.75rem] text-text-secondary font-normal">{couple.subtitle}</p>
      </div>

      <nav className="flex-1 overflow-y-auto min-h-0">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="mb-lg">
            <span className="block text-[0.65rem] font-bold tracking-[1px] text-text-muted uppercase mb-sm pl-[12px]">{group.title}</span>
            <ul className="flex flex-col gap-[2px]">
              {group.items.map((item) => {
                const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link to={item.path} className={navItemClass(isActive)}>
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

      <div className="pt-md border-t border-[rgba(0,0,0,0.06)] shrink-0 mt-auto">
        {isAuthenticated && (
          <Link to="/configuracoes" className={navItemClass(location.pathname === '/configuracoes')}>
            <Settings size={16} strokeWidth={1.8} />
            <span>Configurações</span>
          </Link>
        )}
        {isAuthenticated ? (
          <button className="flex items-center justify-center gap-sm w-full p-[10px] rounded-md text-[0.8rem] font-medium transition-all duration-200 ease-[ease] mt-sm border border-border bg-surface-alt text-text-secondary hover:bg-badge-high hover:text-badge-high-text hover:border-badge-high-text" onClick={logout} type="button">
            <LogOut size={16} /><span>Sair</span>
          </button>
        ) : (
          <button className="flex items-center justify-center gap-sm w-full p-[10px] rounded-md text-[0.8rem] font-medium transition-all duration-200 ease-[ease] mt-sm border-none cursor-pointer bg-primary text-white hover:bg-primary-hover" onClick={() => navigate('/login')} type="button">
            <LogOut size={16} /><span>Entrar</span>
          </button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;