import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import './style.css'

function ImageUpload({ currentImage, onImageChange, label = "Foto", description = "Nenhuma imagem adicionada" }) {
  const fileInputRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida.');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      alert('A imagem é muito grande. O limite é 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      onImageChange(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    if (window.confirm(`Remover a ${label.toLowerCase()}?`)) {
      onImageChange(null);
    }
  };

  return (
    <div 
      className="image-upload-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {currentImage ? (
        <div className="image-upload-preview">
          <img src={currentImage} alt={label} className="image-upload-img" />
          <div className={`image-upload-overlay ${isHovered ? 'visible' : ''}`}>
            <button className="image-upload-btn image-upload-btn-remove" onClick={handleRemove} title="Remover">
              <X size={16} />
            </button>
            <button className="image-upload-btn image-upload-btn-change" onClick={() => fileInputRef.current?.click()} title="Trocar">
              <Upload size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="image-upload-placeholder" onClick={() => fileInputRef.current?.click()}>
          <ImageIcon size={24} />
          <span>{description}</span>
          <span className="image-upload-hint">Clique para adicionar</span>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        aria-label={`Selecionar ${label}`}
      />
    </div>
  );
}

export default ImageUpload;