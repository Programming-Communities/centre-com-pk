// components/skeletons/ToolSkeleton.tsx
'use client';

import CardSkeleton from './CardSkeleton';
import StatsSkeleton from './StatsSkeleton';
import TableSkeleton from './TableSkeleton';
import FAQSkeleton from './FAQSkeleton';

export default function ToolSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Breadcrumbs Skeleton */}
          <div className="w-full py-4 mb-6 animate-pulse">
            <div className="flex items-center gap-2">
              <div className="h-4 w-12 rounded bg-border" />
              <div className="w-4 h-4 rounded bg-border" />
              <div className="h-4 w-12 rounded bg-border" />
              <div className="w-4 h-4 rounded bg-border" />
              <div className="h-4 w-24 rounded bg-border" />
            </div>
          </div>
          
          {/* Header Skeleton */}
          <div className="mb-8 rounded-2xl p-6 md:p-8 animate-pulse bg-surface border border-border">
            <div className="h-8 bg-border rounded w-3/4 mb-3" />
            <div className="h-4 bg-border rounded w-full mb-2" />
            <div className="h-4 bg-border rounded w-2/3" />
          </div>
          
          {/* Tool Container Skeleton */}
          <div className="bg-surface rounded-2xl shadow-lg border border-border p-4 md:p-6 mb-8 animate-pulse">
            
            {/* Date Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {[1, 2].map((_, idx) => (
                <div key={idx} className="rounded-xl p-4 bg-surface border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-border" />
                    <div>
                      <div className="h-5 bg-border rounded w-24 mb-1" />
                      <div className="h-3 bg-border rounded w-32" />
                    </div>
                  </div>
                  <div className="h-6 bg-border rounded w-48 mb-2" />
                  <div className="h-8 bg-border rounded w-32" />
                </div>
              ))}
            </div>
            
            {/* Input Fields Skeleton */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-1">
                <div className="h-4 bg-border rounded w-32 mb-2" />
                <div className="h-10 bg-border rounded w-full" />
              </div>
              <div className="flex-1">
                <div className="h-4 bg-border rounded w-32 mb-2" />
                <div className="h-10 bg-border rounded w-full" />
                <div className="h-3 bg-border rounded w-48 mt-2" />
              </div>
            </div>
            
            {/* Buttons Skeleton */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="h-12 rounded-lg w-40 bg-primary/50" />
              <div className="h-12 rounded-lg w-24 bg-border" />
              <div className="h-12 rounded-lg w-32 bg-border" />
            </div>
            
            {/* Results Grid Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-lg p-4 text-center bg-surface border border-border">
                  <div className="h-8 bg-border rounded w-16 mx-auto mb-2" />
                  <div className="h-3 bg-border rounded w-12 mx-auto" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Share Section Skeleton */}
          <div className="mb-8 rounded-xl p-6 animate-pulse bg-surface border border-border">
            <div className="h-6 bg-border rounded w-40 mx-auto mb-2" />
            <div className="h-4 bg-border rounded w-64 mx-auto mb-4" />
            <div className="flex justify-center gap-3 mb-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-24 h-10 rounded-lg bg-border" />
              ))}
            </div>
            <div className="h-10 bg-border rounded w-48 mx-auto" />
          </div>
          
          {/* Ranking Analysis Skeleton */}
          <div className="mb-8 rounded-xl p-6 animate-pulse bg-surface border border-border">
            <div className="h-7 bg-border rounded w-64 mb-6" />
            <StatsSkeleton count={3} />
            <div className="h-6 bg-border rounded w-40 mb-4" />
            <TableSkeleton rows={5} columns={5} />
            <div className="h-6 bg-border rounded w-40 mt-6 mb-4" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-border" />
                  <div className="h-4 bg-border rounded w-48" />
                </div>
              ))}
            </div>
          </div>
          
          {/* FAQ Section Skeleton */}
          <div className="mb-8 rounded-xl p-6 animate-pulse bg-surface border border-border">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-full bg-border mx-auto mb-4" />
              <div className="h-7 bg-border rounded w-64 mx-auto mb-2" />
              <div className="h-4 bg-border rounded w-96 mx-auto" />
            </div>
            <FAQSkeleton count={5} />
            <div className="mt-8 p-6 rounded-xl text-center">
              <div className="h-6 bg-border rounded w-48 mx-auto mb-2" />
              <div className="h-4 bg-border rounded w-64 mx-auto mb-4" />
              <div className="h-10 bg-border rounded w-36 mx-auto" />
            </div>
          </div>
          
          {/* Related Tools Skeleton */}
          <div className="mb-8">
            <div className="h-7 bg-border rounded w-48 mb-6" />
            <CardSkeleton count={8} columns={4} />
          </div>
        </div>
      </div>
    </div>
  );
}