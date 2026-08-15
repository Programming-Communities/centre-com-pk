"use client";
import { useState } from "react";
import { useTheme } from "@/components/theme/contexts/ThemeContext";
import { CheckCircle, Mail, Phone, Globe } from "lucide-react";

const AD_SPACES = [
  { id: 'header', name: 'Header Banner', size: '728x90', price: 199, views: '50k+/month', location: 'Top of all pages' },
  { id: 'sidebar', name: 'Sidebar Ad', size: '300x600', price: 149, views: '30k+/month', location: 'Right sidebar' },
  { id: 'in-content', name: 'In-Content', size: '728x90', price: 99, views: '20k+/month', location: 'Inside tool pages' },
  { id: 'tool-sponsor', name: 'Tool Sponsor', size: 'Custom', price: 249, views: '10k+/month', location: 'Specific tool page' },
  { id: 'footer', name: 'Footer Banner', size: '728x90', price: 79, views: '40k+/month', location: 'Bottom of pages' },
];

export default function AdvertiseClient({ lang }: { lang: string }) {
  const { themeColors, isDarkMode } = useTheme();
  const [form, setForm] = useState({ companyName: "", contactEmail: "", phone: "", adSpace: "header", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/ads/purchase", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, duration: 30 }) });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "var(--background)" }}>
        <div className="text-center max-w-md p-8 rounded-xl" style={{ backgroundColor: "var(--surface)" }}>
          <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--success)" }} />
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Request Sent!</h1>
          <p style={{ color: "var(--text-secondary)" }}>We'll contact you at {form.contactEmail} within 24 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>📢 Advertise on Centre.com.pk</h1>
          <p style={{ color: "var(--text-secondary)" }}>Reach 50,000+ monthly visitors — developers, designers, students</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {AD_SPACES.map(ad => (
            <div key={ad.id} className="rounded-xl border p-5 transition-all hover:shadow-lg" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{ad.name}</h3>
              <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{ad.size} • {ad.location}</p>
              <div className="text-3xl font-black mt-3" style={{ color: "var(--primary)" }}>${ad.price}<span className="text-sm font-normal" style={{ color: "var(--text-secondary)" }}>/month</span></div>
              <p className="text-xs mt-2" style={{ color: "var(--success)" }}>👁️ {ad.views} views</p>
            </div>
          ))}
        </div>

        <div className="max-w-xl mx-auto rounded-xl border p-6" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Get Started</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} placeholder="Company Name *" required className="w-full p-3 border rounded-lg" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
            <input value={form.contactEmail} onChange={e => setForm({...form, contactEmail: e.target.value})} type="email" placeholder="Email *" required className="w-full p-3 border rounded-lg" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
            <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Phone (optional)" className="w-full p-3 border rounded-lg" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
            <select value={form.adSpace} onChange={e => setForm({...form, adSpace: e.target.value})} className="w-full p-3 border rounded-lg" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }}>
              {AD_SPACES.map(ad => <option key={ad.id} value={ad.id}>{ad.name} — ${ad.price}/month</option>)}
            </select>
            <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Additional details..." rows={3} className="w-full p-3 border rounded-lg" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
            <button type="submit" className="w-full py-3 text-white rounded-xl font-bold text-lg" style={{ backgroundColor: "var(--primary)" }}>Submit Request</button>
          </form>
        </div>
      </div>
    </div>
  );
}
