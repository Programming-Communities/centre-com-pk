"use client";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme/contexts/ThemeContext";
import { Package, DollarSign, Users, CheckCircle } from "lucide-react";

export default function PackagesClient({ lang }: { lang: string }) {
  const { themeColors, isDarkMode } = useTheme();
  const isRTL = lang === "ur" || lang === "ar";
  const [packages, setPackages] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/packages?action=list").then(r => r.json()).then(d => setPackages(d.packages || []));
    fetch("/api/admin/packages?action=sales").then(r => r.json()).then(d => setSales(d.sales || []));
    setLoading(false);
  }, []);

  const totalRevenue = sales.reduce((s: number, sale: any) => s + (sale.amount || 0), 0);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)", direction: isRTL ? "rtl" : "ltr" }}>
      
      <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6 overflow-auto w-full">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>💰 Packages & Revenue</h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Total Revenue: ${totalRevenue.toFixed(2)}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {packages.map((pkg: any) => (
              <div key={pkg.id} className="rounded-xl border p-5" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between mb-3">
                  <Package className="w-8 h-8" style={{ color: "var(--primary)" }} />
                  <span className="text-lg font-bold" style={{ color: "var(--primary)" }}>${pkg.price}</span>
                </div>
                <h3 className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>{pkg.name}</h3>
                <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{pkg.duration_days > 0 ? `${pkg.duration_days} days` : "Forever"}</p>
                {pkg.features && (
                  <ul className="mt-3 space-y-1">
                    {JSON.parse(pkg.features).map((f: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                        <CheckCircle className="w-3 h-3" style={{ color: "var(--success)" }} />{f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Recent Sales</h2>
          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: "var(--surface)" }}>
                <tr><th className="p-3 text-left">User</th><th className="p-3 text-left">Package</th><th className="p-3 text-left">Amount</th><th className="p-3 text-left">Date</th></tr>
              </thead>
              <tbody>
                {sales.slice(0, 20).map((sale: any) => (
                  <tr key={sale.id} className="border-t" style={{ borderColor: "var(--border)" }}>
                    <td className="p-3" style={{ color: "var(--text-primary)" }}>{sale.user_name || "User #" + sale.user_id}</td>
                    <td className="p-3" style={{ color: "var(--text-secondary)" }}>{sale.package_name || "Package"}</td>
                    <td className="p-3 font-medium" style={{ color: "var(--success)" }}>${sale.amount}</td>
                    <td className="p-3 text-xs" style={{ color: "var(--text-secondary)" }}>{sale.created_at ? new Date(sale.created_at).toLocaleDateString() : "-"}</td>
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
