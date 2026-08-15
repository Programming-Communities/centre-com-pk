'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Shield, Crown, User, Edit3, Users, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import TableSkeleton from '@/components/skeletons/TableSkeleton';

export default function RolesClient({ lang }: { lang: string }) {
  const { themeColors, isDarkMode } = useTheme();
  const [roles, setRoles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const textPrimary = themeColors.text?.primary || '#0f172a';
  const textSecondary = themeColors.text?.secondary || '#64748b';
  const border = themeColors.border || '#e2e8f0';
  const surface = themeColors.surface || '#ffffff';
  const primary = themeColors.primary || '#3b82f6';

  useEffect(() => {
    fetch('/api/admin/roles')
      .then(r => r.json())
      .then(d => { setRoles(d.roles || []); setUsers(d.users || []); })
      .finally(() => setLoading(false));
  }, []);

  const updateRole = async (userId: string, newRole: string) => {
    await fetch('/api/admin/roles', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role: newRole }),
    });
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setEditingUser(null);
  };

  const roleIcons: Record<string, any> = {
    super_admin: { icon: Crown, color: '#f59e0b', bg: '#f59e0b15' },
    admin: { icon: Shield, color: '#ef4444', bg: '#ef444415' },
    moderator: { icon: Users, color: '#8b5cf6', bg: '#8b5cf615' },
    editor: { icon: Edit3, color: '#3b82f6', bg: '#3b82f615' },
    user: { icon: User, color: '#10b981', bg: '#10b98115' },
  };

  if (loading) return <TableSkeleton rows={8} cols={5} />;

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = !filterRole || u.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: textPrimary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Shield size={24} color={primary} /> Roles & Permissions
      </h1>

      {/* Role Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '28px' }}>
        {roles.map((role: any) => {
          const ri = roleIcons[role.name] || roleIcons.user;
          const Icon = ri.icon;
          return (
            <div key={role.id} style={{ padding: '18px', background: surface, borderRadius: '12px', border: `1px solid ${border}`, borderLeft: `4px solid ${ri.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: ri.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={ri.color} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: textPrimary, textTransform: 'capitalize' }}>{role.name.replace('_', ' ')}</div>
                  <div style={{ fontSize: '11px', color: textSecondary }}>{role.description}</div>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: ri.color, fontWeight: 600 }}>
                {JSON.parse(role.permissions || '[]').length} permissions
              </div>
            </div>
          );
        })}
      </div>

      {/* Users Table */}
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: textPrimary, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Users size={20} /> User Role Assignments
      </h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
          <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 34px', borderRadius: '8px', border: `1px solid ${border}`, backgroundColor: surface, color: textPrimary, fontSize: '13px' }} />
        </div>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '8px', border: `1px solid ${border}`, backgroundColor: surface, color: textPrimary, fontSize: '13px' }}>
          <option value="">All Roles</option>
          {roles.map((r: any) => <option key={r.id} value={r.name}>{r.name.replace('_', ' ')}</option>)}
        </select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${border}` }}>
              {['User', 'Email', 'Current Role', 'Change Role', ''].map(h => (
                <th key={h} style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: textSecondary }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user: any) => {
              const ri = roleIcons[user.role] || roleIcons.user;
              const Icon = ri.icon;
              return (
                <tr key={user.id} style={{ borderBottom: `1px solid ${border}` }}>
                  <td style={{ padding: '10px 12px', fontWeight: 500, color: textPrimary }}>{user.name || 'N/A'}</td>
                  <td style={{ padding: '10px 12px', fontSize: '13px', color: textSecondary }}>{user.email}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '14px', fontSize: '11px', fontWeight: 600, background: ri.bg, color: ri.color, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Icon size={12} /> {user.role?.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    {editingUser === user.id ? (
                      <select defaultValue={user.role} onChange={e => updateRole(user.id, e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${border}`, fontSize: '12px' }}>
                        {roles.map((r: any) => <option key={r.id} value={r.name}>{r.name.replace('_', ' ')}</option>)}
                      </select>
                    ) : (
                      <button onClick={() => setEditingUser(user.id)}
                        style={{ padding: '6px 12px', borderRadius: '6px', border: `1px solid ${border}`, background: 'transparent', cursor: 'pointer', color: primary, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Edit3 size={12} /> Change
                      </button>
                    )}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    {editingUser === user.id && (
                      <button onClick={() => setEditingUser(null)}
                        style={{ padding: '4px 8px', borderRadius: '4px', border: 'none', background: `${textSecondary}20`, color: textSecondary, cursor: 'pointer', fontSize: '11px' }}>
                        <XCircle size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
