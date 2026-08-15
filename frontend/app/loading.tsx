import { CardSkeleton } from '@/components/skeletons';

export default function HomeLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <div className="relative py-20 mb-8">
        <div className="text-center animate-pulse">
          <div className="h-8 w-48 rounded mx-auto mb-4 bg-border" />
          <div className="h-12 w-96 rounded mx-auto mb-6 bg-border" />
          <div className="h-4 w-128 rounded mx-auto bg-border" />
        </div>
      </div>
      
      {/* Categories Skeleton */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="h-8 w-64 rounded mx-auto mb-12 bg-border" />
          <CardSkeleton count={8} columns={4} />
        </div>
      </div>
    </div>
  );
}