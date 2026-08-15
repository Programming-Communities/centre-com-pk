"use client";

interface AdRailProps {
  position: string;
  size?: { width: number; height: number };
  title?: string;
}

export default function AdRail({ position, size, title }: AdRailProps) {
  return (
    <div 
      className="ad-rail"
      style={{
        width: size?.width || 160,
        height: size?.height || 600,
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px dashed #ccc',
        borderRadius: '8px'
      }}
    >
      <span style={{ color: '#999', fontSize: '12px' }}>
        {title || `Ad - ${position}`}
      </span>
    </div>
  );
}
