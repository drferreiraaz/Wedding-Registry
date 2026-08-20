import React from 'react';
import './style.css';

function ImagePlaceholder({ description, className, style }) {
  return (
    <div className={`image-placeholder ${className || ''}`} style={style}>
      <div className="image-placeholder-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
      <span className="image-placeholder-text">{description}</span>
    </div>
  );
}

export default ImagePlaceholder;