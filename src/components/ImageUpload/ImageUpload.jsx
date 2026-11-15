import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadImage } from '../../services/cloudinary';

function ImageUpload({ currentImage, onImageChange, label = "Foto", description = "Nenhuma imagem adicionada" }) {
  const fileInputRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem é muito grande. O limite é 5MB.');
      return;
    }

    setIsUploading(true);

    try {
      // Faz o upload para o Cloudinary
      const result = await uploadImage(file);
      
      // Salva APENAS a URL no estado (não o arquivo Base64 inteiro)
      onImageChange(result.url);
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao fazer upload da imagem. Tente novamente.');
    } finally {
      setIsUploading(false);
      // Limpa o input para permitir selecionar a mesma imagem novamente se necessário
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    if (window.confirm(`Remover a ${label.toLowerCase()}?`)) {
      onImageChange(null);
    }
  };

  return (
    <div 
      className="w-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {currentImage ? (
        <div className="relative w-full rounded-md overflow-hidden border border-border-light">
          <img src={currentImage} alt={label} className="w-full h-[200px] object-cover block" />
          
          {/* Overlay de Loading */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
              <p className="mt-2 text-sm text-white">Enviando...</p>
            </div>
          )}

          {/* Overlay de Ações (só aparece se não estiver carregando) */}
          <div className={`absolute inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center gap-2 transition-opacity duration-200 ease-[ease] ${isHovered && !isUploading ? 'opacity-100' : 'opacity-0'}`}>
            <button 
              type="button"
              className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.9)] flex items-center justify-center text-text-primary transition-transform duration-200 ease-[ease] hover:scale-110 hover:text-danger" 
              onClick={handleRemove} 
              title="Remover"
            >
              <X size={16} />
            </button>
            <button 
              type="button"
              className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.9)] flex items-center justify-center text-text-primary transition-transform duration-200 ease-[ease] hover:scale-110 hover:text-primary" 
              onClick={() => fileInputRef.current?.click()} 
              title="Trocar"
            >
              <Upload size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div 
          className={`w-full h-[200px] border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center gap-2 text-text-muted cursor-pointer transition-all duration-200 ease-[ease] bg-surface-alt hover:border-primary hover:text-primary hover:bg-primary-lighter ${isUploading ? 'pointer-events-none opacity-70' : ''}`} 
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-sm">Enviando imagem...</span>
            </>
          ) : (
            <>
              <ImageIcon size={24} />
              <span>{description}</span>
              <span className="text-[0.75rem] underline">Clique para adicionar</span>
            </>
          )}
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={isUploading}
        aria-label={`Selecionar ${label}`}
      />
    </div>
  );
}

export default ImageUpload;