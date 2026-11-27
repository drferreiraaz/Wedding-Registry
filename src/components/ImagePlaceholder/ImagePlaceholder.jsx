import React from 'react';

const baseClasses = 'flex flex-col items-center justify-center bg-surface-alt text-text-muted text-center';

const variants = {
  default: 'border-2 border-dashed border-border rounded-md gap-sm p-lg',
  plain: 'rounded-md gap-sm p-lg',
};

function ImagePlaceholder({ description, className, style, variant = 'default' }) {
  return (
    <div className={`${baseClasses} ${variants[variant] || variants.default} ${className || ''}`} style={style}>
      <div className="opacity-50">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
      <span className="text-[0.8rem] italic text-text-muted">{description}</span>
    </div>
  );
}

export default ImagePlaceholder;
