import { CardSkeleton } from '@/components/skeletons';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-pulse">
          <div className="h-10 bg-border rounded w-48 mb-4" />
          <div className="h-4 bg-border rounded w-96" />
        </div>
        <CardSkeleton count={6} columns={3} />
      </div>
    </div>
  );
}
