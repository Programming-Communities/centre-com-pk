'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Trash2, Search, Shield, Crown, User, Eye, Phone, Mail } from 'lucide-react';

export default function UsersPageClient() {
  const { themeColors, isDarkMode } = useTheme();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const textPrimary = themeColors.text?.primary || '#0f172a';
  const textSecondary = themeColors.text?.secondary || '#64748b';
  const border = themeColors.border || '#e2e8f0';
  const surface = themeColors.surface || '#ffffff';
  const primary = themeColors.primary || '#3b82f6';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  const roleBadge = (role: string) => {
    const colors: Record<string, { bg: string; color: string; icon: any }> = {
      super_admin: { bg: '#f59e0b20', color: '#f59e0b', icon: Crown },
      admin: { bg: '#ef444420', color: '#ef4444', icon: Shield },
      user: { bg: '#3b82f620', color: '#3b82f6', icon: User },
    };
    const c = colors[role] || colors.user;
    const Icon = c.icon;
    return (
      <span style={{ padding: '3px 10px', borderRadius: '14px', fontSize: '11px', fontWeight: 600, background: c.bg, color: c.color, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <Icon size={12} /> {role}
      </span>
    );
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: textPrimary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        👥 User Manager
        <span style={{ fontSize: '14px', fontWeight: 400, color: textSecondary }}>({users.length} users)</span>
      </h1>

      {/* Search Bar */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '300px', marginBottom: '20px' }}>
        <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
        <input 
          type="text" 
          placeholder="Search users..." 
          value={search} 
          onChange={e => setSearch(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '10px 14px 10px 32px', 
            borderRadius: '8px', 
            border: `1px solid ${border}`, 
            backgroundColor: surface, 
            color: textPrimary,
            fontSize: '13px'
          }} 
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: textSecondary }}>Loading...</div>
      ) : (
        <>
          {/* ========== MOBILE CARDS — < 640px ========== */}
          <div className="md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredUsers.map((user: any) => {
              const roleColors: Record<string, any> = {
                super_admin: { bg: '#f59e0b20', color: '#f59e0b' },
                admin: { bg: '#ef444420', color: '#ef4444' },
                user: { bg: '#3b82f620', color: '#3b82f6' },
              };
              const rc = roleColors[user.role] || roleColors.user;

              return (
                <div key={user.id} style={{ 
                  padding: '16px', 
                  background: surface, 
                  borderRadius: '12px', 
                  border: `1px solid ${border}` 
                }}>
                  {/* Header: Avatar + Name + Email */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ 
                      width: '44px', 
                      height: '44px', 
                      borderRadius: '50%', 
                      background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'var(--text-accent)', 
                      fontWeight: 700, 
                      fontSize: '18px',
                      flexShrink: 0
                    }}>
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 600, color: textPrimary, fontSize: '15px', marginBottom: '2px' }}>
                        {user.name || 'N/A'}
                      </div>
                      <div style={{ fontSize: '12px', color: textSecondary, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={12} /> {user.email}
                      </div>
                    </div>
                  </div>

                  {/* Badges: Role + Plan + Status */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '12px', 
                      fontSize: '11px', 
                      fontWeight: 600,
                      background: rc.bg, 
                      color: rc.color,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {roleBadge(user.role || 'user')}
                    </span>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '12px', 
                      fontSize: '11px', 
                      fontWeight: 600,
                      background: 'var(--surface)', 
                      color: textSecondary,
                      border: `1px solid ${border}`
                    }}>
                      📦 {user.plan || 'free'}
                    </span>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '12px', 
                      fontSize: '11px', 
                      fontWeight: 600,
                      background: user.status === 'active' ? '#10b98120' : '#f59e0b20',
                      color: user.status === 'active' ? '#10b981' : '#f59e0b',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {user.status === 'active' ? '✅' : '⏳'} {user.status || 'active'}
                    </span>
                  </div>

                  {/* Joined Date */}
                  <div style={{ fontSize: '12px', color: textSecondary, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    📅 {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                  </div>

                  {/* Delete Button */}
                  <div style={{ paddingTop: '12px', borderTop: `1px solid ${border}` }}>
                    <button 
                      onClick={() => deleteUser(user.id)} 
                      style={{ 
                        width: '100%',
                        padding: '8px 14px', 
                        borderRadius: '8px', 
                        border: '1px solid #ef4444', 
                        background: '#ef444410', 
                        cursor: 'pointer', 
                        color: '#ef4444',
                        fontSize: '12px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Trash2 size={14} /> Delete User
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredUsers.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: textSecondary }}>
                No users found
              </div>
            )}
          </div>

          {/* ========== DESKTOP TABLE — > 640px ========== */}
          <div className="hidden md:block" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${border}` }}>
                  {['User', 'Email', 'Role', 'Plan', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: textSecondary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user: any) => (
                  <tr key={user.id} style={{ borderBottom: `1px solid ${border}` }}>
                    <td style={{ padding: '10px 12px', fontWeight: 500, color: textPrimary }}>{user.name || 'N/A'}</td>
                    <td style={{ padding: '10px 12px', fontSize: '13px', color: textSecondary }}>{user.email}</td>
                    <td style={{ padding: '10px 12px' }}>{roleBadge(user.role || 'user')}</td>
                    <td style={{ padding: '10px 12px', fontSize: '12px', color: textSecondary }}>{user.plan || 'free'}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, background: user.status === 'active' ? '#10b98120' : '#f59e0b20', color: user.status === 'active' ? '#10b981' : '#f59e0b' }}>
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: '12px', color: textSecondary }}>{user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <button onClick={() => deleteUser(user.id)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ef4444', background: '#ef444410', cursor: 'pointer', color: '#ef4444' }}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}