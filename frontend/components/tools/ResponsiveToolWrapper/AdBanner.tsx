"use client";

interface AdBannerProps {
  position: string;
  size?: { width: number; height: number };
  title?: string;
}

export default function AdBanner({ position, size, title }: AdBannerProps) {
  return (
    <div 
      className="ad-banner"
      style={{
        width: '100%',
        maxWidth: size?.width || 970,
        height: size?.height || 250,
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px dashed #ccc',
        borderRadius: '8px',
        margin: '0 auto'
      }}
    >
      <span style={{ color: '#999', fontSize: '12px' }}>
        {title || `Ad - ${position}`}
      </span>
    </div>
  );
}
