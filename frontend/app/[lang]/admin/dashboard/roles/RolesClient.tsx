'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Shield, Crown, User, Edit3, Users, CheckCircle, XCircle, Search, Filter, Mail } from 'lucide-react';
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

  if (loading) return <TableSkeleton rows={8} />;

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

      {/* ========== ROLE CARDS — Responsive Grid ========== */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '10px', 
        marginBottom: '28px' 
      }}>
        {roles.map((role: any) => {
          const ri = roleIcons[role.name] || roleIcons.user;
          const Icon = ri.icon;
          return (
            <div key={role.id} style={{ 
              padding: '14px', 
              background: surface, 
              borderRadius: '12px', 
              border: `1px solid ${border}`, 
              borderLeft: `4px solid ${ri.color}` 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: ri.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color={ri.color} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: textPrimary, textTransform: 'capitalize', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {role.name.replace('_', ' ')}
                  </div>
                  <div style={{ fontSize: '10px', color: textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {role.description}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '10px', color: ri.color, fontWeight: 600 }}>
                {JSON.parse(role.permissions || '[]').length} permissions
              </div>
            </div>
          );
        })}
      </div>

      {/* Users Section Title */}
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: textPrimary, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Users size={20} /> User Role Assignments
      </h2>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '180px', maxWidth: '100%' }}>
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

      {/* ========== MOBILE CARDS — < 640px ========== */}
      <div className="md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredUsers.map((user: any) => {
          const ri = roleIcons[user.role] || roleIcons.user;
          const Icon = ri.icon;
          return (
            <div key={user.id} style={{ 
              padding: '16px', 
              background: surface, 
              borderRadius: '12px', 
              border: `1px solid ${border}` 
            }}>
              {/* Avatar + Name + Email */}
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

              {/* Current Role Badge */}
              <div style={{ marginBottom: '12px' }}>
                <span style={{ 
                  padding: '4px 12px', 
                  borderRadius: '14px', 
                  fontSize: '11px', 
                  fontWeight: 600, 
                  background: ri.bg, 
                  color: ri.color, 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '4px' 
                }}>
                  <Icon size={12} /> {user.role?.replace('_', ' ')}
                </span>
              </div>

              {/* Role Change Dropdown */}
              <div style={{ paddingTop: '12px', borderTop: `1px solid ${border}` }}>
                {editingUser === user.id ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select defaultValue={user.role} onChange={e => updateRole(user.id, e.target.value)}
                      style={{ 
                        flex: 1, padding: '8px 10px', borderRadius: '8px', 
                        border: `1px solid ${border}`, fontSize: '12px',
                        backgroundColor: 'var(--background)', color: textPrimary
                      }}>
                      {roles.map((r: any) => <option key={r.id} value={r.name}>{r.name.replace('_', ' ')}</option>)}
                    </select>
                    <button onClick={() => setEditingUser(null)}
                      style={{ 
                        padding: '8px 10px', borderRadius: '8px', 
                        border: 'none', background: `${textSecondary}20`, 
                        color: textSecondary, cursor: 'pointer', fontSize: '11px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                      <XCircle size={16} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setEditingUser(user.id)}
                    style={{ 
                      width: '100%', padding: '8px 12px', borderRadius: '8px', 
                      border: `1px solid ${primary}`, background: 'transparent', 
                      cursor: 'pointer', color: primary, fontSize: '12px', fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}>
                    <Edit3 size={14} /> Change Role
                  </button>
                )}
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