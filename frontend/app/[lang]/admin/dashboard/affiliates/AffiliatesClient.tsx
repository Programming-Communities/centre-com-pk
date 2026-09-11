"use client";
import { useState, useEffect } from "react";
import { Share2, DollarSign, Users, Link as LinkIcon, User as UserIcon, Code, TrendingUp, Wallet, Copy } from "lucide-react";

export default function AffiliatesClient({ lang }: { lang: string }) {
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/affiliates?action=list").then(r => r.json()).then(d => setAffiliates(d.affiliates || [])).finally(() => setLoading(false));
  }, []);

  const totalEarnings = affiliates.reduce((s: number, a: any) => s + (a.total_earnings || 0), 0);
  const totalReferrals = affiliates.reduce((s: number, a: any) => s + (a.total_referrals || 0), 0);

  const copyReferralCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      
      <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6 overflow-auto w-full">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>🤝 Affiliate Manager</h1>
          
          {/* Stats Cards — Responsive Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 mt-4">
            <StatCard icon={Users} label="Total Affiliates" value={affiliates.length} color="#3b82f6" />
            <StatCard icon={DollarSign} label="Total Earnings" value={`$${totalEarnings.toFixed(2)}`} color="#10b981" />
            <StatCard icon={LinkIcon} label="Total Referrals" value={totalReferrals} color="#f59e0b" />
            <StatCard icon={Share2} label="Commission Rate" value="10%" color="#8b5cf6" />
          </div>

          {/* ========== MOBILE CARDS — < 640px ========== */}
          <div className="md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading...</div>
            ) : affiliates.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                No affiliates yet
              </div>
            ) : (
              affiliates.map((a: any) => (
                <div key={a.id} style={{ 
                  padding: '16px', 
                  background: 'var(--surface)', 
                  borderRadius: '12px', 
                  border: '1px solid var(--border)' 
                }}>
                  {/* User Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ 
                      width: '44px', 
                      height: '44px', 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'var(--text-accent)', 
                      fontWeight: 700, 
                      fontSize: '18px',
                      flexShrink: 0
                    }}>
                      {(a.user_name || 'U').charAt(0)}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '15px', marginBottom: '2px' }}>
                        {a.user_name || "User #" + a.user_id}
                      </div>
                      <button 
                        onClick={() => copyReferralCode(a.referral_code)}
                        style={{ 
                          fontSize: '12px', 
                          color: copiedCode === a.referral_code ? '#10b981' : 'var(--primary)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Code size={12} /> {copiedCode === a.referral_code ? 'Copied!' : a.referral_code}
                      </button>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: '8px', 
                    marginBottom: '12px',
                    padding: '12px',
                    background: 'var(--background)',
                    borderRadius: '8px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)' }}>{a.total_referrals || 0}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Referrals</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--success)' }}>${a.total_earnings || 0}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Earnings</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#f59e0b' }}>${a.available_balance || 0}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Balance</div>
                    </div>
                  </div>

                  {/* Copy Button */}
                  <button 
                    onClick={() => copyReferralCode(a.referral_code)}
                    style={{ 
                      width: '100%', 
                      padding: '8px 12px', 
                      borderRadius: '8px', 
                      border: `1px solid ${copiedCode === a.referral_code ? '#10b981' : 'var(--primary)'}`, 
                      background: copiedCode === a.referral_code ? '#10b98110' : 'transparent', 
                      cursor: 'pointer', 
                      color: copiedCode === a.referral_code ? '#10b981' : 'var(--primary)',
                      fontSize: '12px', 
                      fontWeight: 600,
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '6px'
                    }}
                  >
                    {copiedCode === a.referral_code ? '✅ Copied!' : <><Copy size={14} /> Copy Referral Code</>}
                  </button>
                </div>
              ))
            )}
          </div>

          {/* ========== DESKTOP TABLE — > 640px ========== */}
          <div className="hidden md:block overflow-x-auto rounded-xl border" style={{ borderColor: "var(--border)" }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading...</div>
            ) : (
              <table className="w-full text-sm">
                <thead style={{ backgroundColor: "var(--surface)" }}>
                  <tr>
                    <th className="p-3 text-left">User</th>
                    <th className="p-3 text-left">Referral Code</th>
                    <th className="p-3 text-left">Referrals</th>
                    <th className="p-3 text-left">Earnings</th>
                    <th className="p-3 text-left">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {affiliates.map((a: any) => (
                    <tr key={a.id} className="border-t" style={{ borderColor: "var(--border)" }}>
                      <td className="p-3" style={{ color: "var(--text-primary)" }}>{a.user_name || "User #"+a.user_id}</td>
                      <td className="p-3">
                        <button 
                          onClick={() => copyReferralCode(a.referral_code)}
                          style={{ 
                            background: 'transparent', 
                            border: 'none', 
                            cursor: 'pointer',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <code className="text-xs" style={{ backgroundColor: "var(--surface)", color: copiedCode === a.referral_code ? '#10b981' : 'var(--primary)' }}>
                            {a.referral_code}
                          </code>
                          <Copy size={10} style={{ color: 'var(--text-secondary)' }} />
                        </button>
                      </td>
                      <td className="p-3" style={{ color: "var(--text-secondary)" }}>{a.total_referrals}</td>
                      <td className="p-3" style={{ color: "var(--success)" }}>${a.total_earnings}</td>
                      <td className="p-3" style={{ color: "var(--primary)" }}>${a.available_balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="rounded-xl border p-3 md:p-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
      <Icon className="w-5 h-5 md:w-6 md:h-6 mb-2" style={{ color }} />
      <div className="text-lg md:text-xl font-bold" style={{ color: "var(--text-primary)" }}>{value}</div>
      <div className="text-[10px] md:text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{label}</div>
    </div>
  );
}