"use client";
import { useState, useEffect } from "react";
import { Share2, DollarSign, Users, Link } from "lucide-react";

export default function AffiliatesClient({ lang }: { lang: string }) {
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/affiliates?action=list").then(r => r.json()).then(d => setAffiliates(d.affiliates || [])).finally(() => setLoading(false));
  }, []);

  const totalEarnings = affiliates.reduce((s: number, a: any) => s + (a.total_earnings || 0), 0);
  const totalReferrals = affiliates.reduce((s: number, a: any) => s + (a.total_referrals || 0), 0);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      
      <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6 overflow-auto w-full">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>🤝 Affiliate Manager</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-4">
            <StatCard icon={Users} label="Total Affiliates" value={affiliates.length} color="#3b82f6" />
            <StatCard icon={DollarSign} label="Total Earnings" value={`$${totalEarnings.toFixed(2)}`} color="#10b981" />
            <StatCard icon={Link} label="Total Referrals" value={totalReferrals} color="#f59e0b" />
            <StatCard icon={Share2} label="Commission Rate" value="10%" color="#8b5cf6" />
          </div>

          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: "var(--surface)" }}>
                <tr><th className="p-3 text-left">User</th><th className="p-3 text-left">Referral Code</th><th className="p-3 text-left">Referrals</th><th className="p-3 text-left">Earnings</th><th className="p-3 text-left">Balance</th></tr>
              </thead>
              <tbody>
                {affiliates.map((a: any) => (
                  <tr key={a.id} className="border-t" style={{ borderColor: "var(--border)" }}>
                    <td className="p-3" style={{ color: "var(--text-primary)" }}>{a.user_name || "User #"+a.user_id}</td>
                    <td className="p-3"><code className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "var(--surface)" }}>{a.referral_code}</code></td>
                    <td className="p-3" style={{ color: "var(--text-secondary)" }}>{a.total_referrals}</td>
                    <td className="p-3" style={{ color: "var(--success)" }}>${a.total_earnings}</td>
                    <td className="p-3" style={{ color: "var(--primary)" }}>${a.available_balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
      <Icon className="w-6 h-6 mb-2" style={{ color }} />
      <div className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{value}</div>
      <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{label}</div>
    </div>
  );
}
