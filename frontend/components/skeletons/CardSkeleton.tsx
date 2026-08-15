// components/skeletons/CardSkeleton.tsx
'use client';

interface CardSkeletonProps {
  count?: number;
  columns?: 1 | 2 | 3 | 4;
}

export default function CardSkeleton({ count = 8, columns = 4 }: CardSkeletonProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-6 animate-pulse`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl overflow-hidden border border-border bg-surface"
        >
          {/* Header Gradient - ✅ FIXED: bg-linear-to-br */}
          <div className="h-32 bg-linear-to-br from-primary/25 to-secondary/25" />
          
          {/* Content */}
          <div className="p-4 space-y-3">
            <div className="h-5 bg-border rounded w-3/4" />
            <div className="h-4 bg-border rounded w-full" />
            <div className="h-4 bg-border rounded w-2/3" />
            
            {/* Features */}
            <div className="pt-2 space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary/50" />
                  <div className="h-3 bg-border rounded w-20" />
                </div>
              ))}
            </div>
            
            {/* Footer */}
            <div className="pt-3 mt-2 border-t border-border flex justify-between items-center">
              <div className="h-4 bg-border rounded w-24" />
              <div className="w-5 h-5 rounded-full bg-border" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}