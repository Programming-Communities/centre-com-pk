// components/skeletons/TableSkeleton.tsx
'use client';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({ rows = 5, columns = 5 }: TableSkeletonProps) {
  return (
    <div className="overflow-x-auto animate-pulse">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="p-3 text-left">
                <div className="h-4 bg-border rounded w-20" />
              </th>
            ))}
           </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="p-3">
                  <div
                    className={`h-4 bg-border rounded ${
                      colIndex === 0 ? 'w-32' : colIndex === 1 ? 'w-12' : 'w-24'
                    }`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}