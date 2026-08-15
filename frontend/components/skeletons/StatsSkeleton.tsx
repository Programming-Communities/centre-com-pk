// components/skeletons/StatsSkeleton.tsx
'use client';

interface StatsSkeletonProps {
  count?: number;
}

export default function StatsSkeleton({ count = 3 }: StatsSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-lg p-4 border border-border bg-surface"
        >
          <div className="h-4 bg-border rounded w-1/3 mb-2" />
          <div className="h-8 bg-border rounded w-2/3 mb-1" />
          <div className="h-3 bg-border rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}