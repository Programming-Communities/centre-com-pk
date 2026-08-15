'use client';
import Skeleton from './Skeleton';

export default function AdminSkeleton() {
  return (
    <div style={{ padding: '30px' }}>
      <Skeleton width="250px" height="32px" />
      <Skeleton width="180px" height="16px" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', margin: '28px 0' }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ padding: '18px', background: 'var(--surface, #fff)', borderRadius: '12px', border: '1px solid var(--border, #e2e8f0)' }}>
            <Skeleton width="22px" height="22px" borderRadius="50%" />
            <Skeleton width="60px" height="24px" />
            <Skeleton width="80px" height="12px" />
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {[1,2,3,4,5,6].map(i => (
          <div key={i} style={{ padding: '22px', background: 'var(--surface, #fff)', borderRadius: '14px', border: '1px solid var(--border, #e2e8f0)' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <Skeleton width="42px" height="42px" borderRadius="10px" />
              <div style={{ flex: 1 }}><Skeleton width="140px" height="18px" /><Skeleton width="80px" height="12px" /></div>
            </div>
            <Skeleton width="100%" height="14px" />
            <Skeleton width="70%" height="14px" />
          </div>
        ))}
      </div>
    </div>
  );
}
