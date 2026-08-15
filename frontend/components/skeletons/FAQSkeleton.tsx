// components/skeletons/FAQSkeleton.tsx
'use client';

interface FAQSkeletonProps {
  count?: number;
}

export default function FAQSkeleton({ count = 5 }: FAQSkeletonProps) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl overflow-hidden border border-border bg-surface"
        >
          <div className="flex items-center justify-between p-5 md:p-6">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-5 h-5 rounded bg-border" />
              <div className="h-5 bg-border rounded w-3/4" />
            </div>
            <div className="w-5 h-5 rounded bg-border" />
          </div>
        </div>
      ))}
    </div>
  );
}