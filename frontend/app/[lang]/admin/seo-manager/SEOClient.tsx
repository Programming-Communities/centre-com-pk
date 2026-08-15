'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Search, TrendingUp, Target, Globe, FileText, BarChart3, Plus, RefreshCw, Zap, ExternalLink, ArrowUp, ArrowDown, CheckCircle } from 'lucide-react';
import TableSkeleton from '@/components/skeletons/TableSkeleton';

export default function SEOClient({ lang }: { lang: string }) {
  const { themeColors } = useTheme();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [newKeyword, setNewKeyword] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const textPrimary = themeColors.text?.primary || '#0f172a';
  const textSecondary = themeColors.text?.secondary || '#64748b';
  const border = themeColors.border || '#e2e8f0';
  const surface = themeColors.surface || '#ffffff';
  const primary = themeColors.primary || '#3b82f6';

  const fetchData = () => {
    setLoading(true);
    fetch('/api/admin/seo?action=overview')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); });
  };

  useEffect(() => { fetchData(); }, []);

  const addKeyword = async () => {
    if (!newKeyword) return;
    await fetch('/api/admin/seo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'add_keyword', keyword: newKeyword, target_url: newUrl }) });
    setNewKeyword(''); setNewUrl('');
    fetchData();
  };

  const checkScores = async () => {
    await fetch('/api/admin/seo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'check_scores' }) });
    fetchData();
  };

  const overview = data?.overview || { totalKeywords: 0, top3: 0, avgPosition: 0, totalVolume: 0 };
  const keywords = data?.keywords || [];

  const stats = [
    { icon: Target, label: 'Keywords Tracked', value: overview.totalKeywords, color: '#3b82f6' },
    { icon: TrendingUp, label: 'Top 3 Rankings', value: overview.top3, color: '#10b981' },
    { icon: BarChart3, label: 'Avg Position', value: overview.avgPosition || '-', color: '#f59e0b' },
    { icon: Globe, label: 'Total Volume', value: (overview.totalVolume || 0).toLocaleString(), color: '#8b5cf6' },
  ];

  if (loading) return <TableSkeleton rows={8} cols={6} />;

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: textPrimary, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Search size={24} color={primary} /> SEO Manager
      </h1>
      <p style={{ fontSize: '14px', color: textSecondary, marginBottom: '24px' }}>Track keywords, analyze content, boost rankings</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ padding: '20px', background: surface, borderRadius: '12px', border: `1px solid ${border}`, textAlign: 'center' }}>
            <s.icon size={24} color={s.color} style={{ marginBottom: '10px' }} />
            <div style={{ fontSize: '26px', fontWeight: 700, color: textPrimary }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: textSecondary, marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: `1px solid ${border}`, paddingBottom: '12px' }}>
        {['overview', 'keywords', 'content', 'sitemap'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: activeTab === tab ? primary : 'transparent', color: activeTab === tab ? '#fff' : textSecondary, fontSize: '13px', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>
            {tab}
          </button>
        ))}
        <button onClick={checkScores} style={{ marginLeft: 'auto', padding: '10px 20px', borderRadius: '8px', border: `1px solid #10b981`, background: '#10b98115', color: '#10b981', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={14} /> Analyze Content
        </button>
      </div>

      {/* Keywords Tab */}
      {activeTab === 'keywords' && (
        <div>
          {/* Add Keyword */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <input type="text" placeholder="Keyword" value={newKeyword} onChange={e => setNewKeyword(e.target.value)}
              style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: `1px solid ${border}`, fontSize: '13px' }} />
            <input type="text" placeholder="Target URL (optional)" value={newUrl} onChange={e => setNewUrl(e.target.value)}
              style={{ flex: 2, padding: '10px 14px', borderRadius: '8px', border: `1px solid ${border}`, fontSize: '13px' }} />
            <button onClick={addKeyword} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: primary, color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} /> Add
            </button>
          </div>

          {/* Keywords Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${border}` }}>
                  {['Keyword', 'Position', 'Volume', 'Difficulty', 'Target URL', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: textSecondary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {keywords.map((k: any) => (
                  <tr key={k.id} style={{ borderBottom: `1px solid ${border}` }}>
                    <td style={{ padding: '10px 12px', fontWeight: 500, color: textPrimary }}>{k.keyword}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: k.position <= 3 ? '#10b98120' : k.position <= 10 ? '#f59e0b20' : '#ef444420', color: k.position <= 3 ? '#10b981' : k.position <= 10 ? '#f59e0b' : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                        {k.position <= 3 ? <ArrowUp size={12} /> : <ArrowDown size={12} />} #{k.position}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: '13px', color: textSecondary }}>{(k.search_volume || 0).toLocaleString()}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ width: '60px', height: '6px', background: `${primary}20`, borderRadius: '3px' }}>
                        <div style={{ width: `${k.difficulty || 0}%`, height: '100%', background: primary, borderRadius: '3px' }} />
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: '12px', color: primary }}>{k.target_url || '-'}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', background: '#10b98120', color: '#10b981' }}>● Tracking</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: textSecondary }}>
          <FileText size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
          <h3 style={{ color: textPrimary, marginBottom: '8px' }}>Content Analysis</h3>
          <p style={{ marginBottom: '20px' }}>Click "Analyze Content" to scan all blog posts for SEO scores</p>
          <button onClick={checkScores} style={{ padding: '12px 28px', borderRadius: '8px', border: 'none', background: primary, color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
            <Zap size={16} /> Analyze Now
          </button>
        </div>
      )}

      {/* Sitemap Tab */}
      {activeTab === 'sitemap' && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: textSecondary }}>
          <Globe size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
          <h3 style={{ color: textPrimary, marginBottom: '8px' }}>XML Sitemap</h3>
          <p style={{ marginBottom: '20px' }}>Generate and submit sitemap to Google & Bing</p>
          <button onClick={async () => { await fetch('/api/admin/seo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'generate_sitemap' }) }); fetchData(); }}
            style={{ padding: '12px 28px', borderRadius: '8px', border: 'none', background: '#10b981', color: '#fff', fontWeight: 600, cursor: 'pointer', marginRight: '10px' }}>
            Generate Sitemap
          </button>
        </div>
      )}

      {/* Overview Tab (default) */}
      {activeTab === 'overview' && (
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: textPrimary, marginBottom: '16px' }}>📈 Keyword Rankings</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${border}` }}>
                  {['Keyword', 'Position', 'Volume', 'Difficulty', 'Target'].map(h => (
                    <th key={h} style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: textSecondary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {keywords.slice(0, 10).map((k: any) => (
                  <tr key={k.id} style={{ borderBottom: `1px solid ${border}` }}>
                    <td style={{ padding: '10px 12px', fontWeight: 500, color: textPrimary }}>{k.keyword}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: k.position <= 3 ? '#10b98120' : k.position <= 10 ? '#f59e0b20' : '#ef444420', color: k.position <= 3 ? '#10b981' : k.position <= 10 ? '#f59e0b' : '#ef4444' }}>#{k.position}</span>
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: '13px', color: textSecondary }}>{(k.search_volume || 0).toLocaleString()}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ width: '60px', height: '6px', background: `${primary}20`, borderRadius: '3px' }}>
                        <div style={{ width: `${k.difficulty || 0}%`, height: '100%', background: primary, borderRadius: '3px' }} />
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: '12px', color: primary }}>{k.target_url || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
