// components/ui/AdPlaceholder/AdPlaceholder.tsx
interface AdPlaceholderProps {
  type?: 'banner' | 'sidebar' | 'rectangle';
  title?: string;
}

export default function AdPlaceholder({ 
  type = 'banner',
  title = 'Advertisement'
}: AdPlaceholderProps) {
  const sizes = {
    banner: 'w-full h-24',
    sidebar: 'w-48 h-96',
    rectangle: 'w-80 h-64'
  };

  return (
    <div className={`${sizes[type]} bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center`}>
      <div className="text-center">
        <div className="text-gray-500 text-sm font-medium mb-1">{title}</div>
        <div className="text-gray-400 text-xs">Ad Space</div>
      </div>
    </div>
  );
}