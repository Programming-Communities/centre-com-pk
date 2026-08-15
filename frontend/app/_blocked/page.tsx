import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
};

export default function BlockedPage() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      fontFamily: 'system-ui'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '72px', margin: 0 }}>🚫</h1>
        <h2 style={{ margin: '16px 0' }}>Access Denied</h2>
        <p style={{ color: '#666' }}>This resource is not available.</p>
      </div>
    </div>
  );
}
