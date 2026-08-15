'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function AdminTopBar({ lang }: { lang: string }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: '32px',
      backgroundColor: '#1d2327', color: '#f0f0f1', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px', fontSize: '13px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href={`/${lang}`} target="_blank" style={{ color: '#f0f0f1', textDecoration: 'none', fontWeight: 600 }}>
          🏠 Centre.com.pk
        </Link>
        <span style={{ color: '#787c82' }}>|</span>
        <span style={{ fontWeight: 600 }}>Admin Panel</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href={`/${lang}`} target="_blank" style={{ color: '#f0f0f1', textDecoration: 'none' }}>
          View Site
        </Link>
        <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#2271b1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
          A
        </span>
      </div>
    </div>
  );
}
