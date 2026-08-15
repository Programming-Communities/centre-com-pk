"use client";
import { Share2, Copy, DollarSign } from "lucide-react";
import { useState } from "react";

export default function UserAffiliateClient({ lang }: { lang: string }) {
  const [copied, setCopied] = useState(false);
  const refLink = "https://www.centre.com.pk?ref=user123";

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      
      <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6 overflow-auto w-full">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>🤝 Affiliate Program</h1>
          <div className="rounded-xl border p-6 mb-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
            <h3 className="font-bold mb-2" style={{ color: "var(--text-primary)" }}>Your Referral Link</h3>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2.5 rounded-lg text-sm break-all" style={{ backgroundColor: "var(--background)", color: "var(--primary)" }}>{refLink}</code>
              <button onClick={() => { navigator.clipboard.writeText(refLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="p-2.5 rounded-lg text-white" style={{ backgroundColor: "var(--primary)" }}>
                {copied ? "✅" : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border p-4 text-center" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <DollarSign className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--success)" }} />
              <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>$0.00</div>
              <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Total Earnings</div>
            </div>
            <div className="rounded-xl border p-4 text-center" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <Share2 className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--primary)" }} />
              <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>0</div>
              <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Referrals</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
