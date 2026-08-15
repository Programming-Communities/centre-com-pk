export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-10 bg-border rounded w-64 mb-6" />
          <div className="h-4 bg-border rounded w-full mb-3" />
          <div className="h-4 bg-border rounded w-full mb-3" />
          <div className="h-4 bg-border rounded w-5/6 mb-8" />
          <div className="h-4 bg-border rounded w-full mb-3" />
          <div className="h-4 bg-border rounded w-full mb-3" />
          <div className="h-4 bg-border rounded w-4/5" />
        </div>
      </div>
    </div>
  );
}
