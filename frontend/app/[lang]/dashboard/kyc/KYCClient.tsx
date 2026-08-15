"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme/contexts/ThemeContext";
import { 
  User, Phone, MapPin, Globe, CreditCard, FileText, Send, 
  CheckCircle, Clock, XCircle, AlertTriangle, ArrowLeft, Shield 
} from "lucide-react";
import Link from "next/link";

export default function KYCClient({ lang }: { lang: string }) {
  const { themeColors, isDarkMode } = useTheme();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [kyc, setKyc] = useState<any>(null);
  const [verification, setVerification] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    full_name: "", phone: "", address: "", city: "", country: "Pakistan",
    id_type: "cnic", id_number: ""
  });

  useEffect(() => {
    const d = localStorage.getItem("user_data");
    if (!d) { router.push("/" + lang + "/auth/signin"); return; }
    const u = JSON.parse(d);
    setUser(u);
    setForm(prev => ({ ...prev, full_name: u.name || "" }));
    fetchKYC();
  }, []);

  const fetchKYC = async () => {
    const token = localStorage.getItem("auth_token");
    const res = await fetch("/api/user/kyc", { headers: { "Authorization": "Bearer " + token } });
    const data = await res.json();
    setKyc(data.kyc);
    setVerification(data.verification);
    if (data.kyc) {
      setForm({
        full_name: data.kyc.full_name || "",
        phone: data.kyc.phone || "",
        address: data.kyc.address || "",
        city: data.kyc.city || "",
        country: data.kyc.country || "Pakistan",
        id_type: data.kyc.id_type || "cnic",
        id_number: data.kyc.id_number || ""
      });
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.phone || !form.address || !form.id_number) {
      setMessage("❌ Please fill all required fields!");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    setSubmitting(true);
    const token = localStorage.getItem("auth_token");
    const res = await fetch("/api/user/kyc", {
      method: "POST",
      headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setMessage(data.success ? "✅ KYC submitted! Awaiting admin approval." : "❌ " + (data.error || "Failed"));
    setSubmitting(false);
    fetchKYC();
    setTimeout(() => setMessage(""), 3000);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)" }}>
        
        <main className="flex-1 p-6 pt-16 lg:pt-6 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full" style={{ borderColor: "var(--primary) var(--primary) var(--primary) transparent" }} />
        </main>
      </div>
    );
  }

  const isPending = kyc?.status === "pending";
  const isApproved = kyc?.status === "approved";
  const isRejected = kyc?.status === "rejected";

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      
      <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6 w-full">
        <div className="max-w-2xl mx-auto">
          <Link href={"/" + lang + "/dashboard"} className="inline-flex items-center gap-2 text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>

          {/* Status Banner */}
          {isPending && (
            <div className="mb-6 p-4 rounded-xl flex items-center gap-3" style={{ backgroundColor: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)" }}>
              <Clock size={24} style={{ color: "#f59e0b" }} />
              <div>
                <h3 className="font-bold" style={{ color: "#f59e0b" }}>Verification Pending</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Your KYC is under review. You'll be notified once approved.</p>
              </div>
            </div>
          )}
          {isApproved && (
            <div className="mb-6 p-4 rounded-xl flex items-center gap-3" style={{ backgroundColor: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}>
              <CheckCircle size={24} style={{ color: "#10b981" }} />
              <div>
                <h3 className="font-bold" style={{ color: "#10b981" }}>Verified ✅</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>You have full access — documents, posts, and ads unlocked!</p>
              </div>
            </div>
          )}
          {isRejected && (
            <div className="mb-6 p-4 rounded-xl flex items-center gap-3" style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
              <XCircle size={24} style={{ color: "#ef4444" }} />
              <div>
                <h3 className="font-bold" style={{ color: "#ef4444" }}>Rejected</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Reason: {kyc?.notes || "Please resubmit with correct information."}</p>
              </div>
            </div>
          )}

          {!isApproved && (
            <>
              <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                <Shield size={24} className="inline mr-2" style={{ color: "var(--primary)" }} />
                KYC Verification
              </h1>
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                Complete verification to unlock documents, posts, and advertising features.
              </p>

              {message && (
                <div className="mb-4 p-3 rounded-xl text-white text-sm" style={{ backgroundColor: message.includes("✅") ? "var(--success)" : "var(--error)" }}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="rounded-xl border p-6 space-y-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm mb-1.5 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}><User size={14} /> Full Name *</label>
                    <input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} placeholder="As per ID document" required
                      className="w-full p-3 border rounded-lg text-sm" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}><Phone size={14} /> Phone *</label>
                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+92 300 1234567" required
                      className="w-full p-3 border rounded-lg text-sm" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                  </div>
                </div>
                <div>
                  <label className="text-sm mb-1.5 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}><MapPin size={14} /> Address *</label>
                  <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Street address" required
                    className="w-full p-3 border rounded-lg text-sm" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm mb-1.5 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>City</label>
                    <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="City"
                      className="w-full p-3 border rounded-lg text-sm" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}><Globe size={14} /> Country</label>
                    <input value={form.country} onChange={e => setForm({...form, country: e.target.value})} placeholder="Country"
                      className="w-full p-3 border rounded-lg text-sm" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm mb-1.5 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}><CreditCard size={14} /> ID Type *</label>
                    <select value={form.id_type} onChange={e => setForm({...form, id_type: e.target.value})}
                      className="w-full p-3 border rounded-lg text-sm" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }}>
                      <option value="cnic">CNIC (Pakistan)</option>
                      <option value="passport">Passport</option>
                      <option value="driving_license">Driving License</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}><FileText size={14} /> ID Number *</label>
                    <input value={form.id_number} onChange={e => setForm({...form, id_number: e.target.value})} placeholder="12345-1234567-1" required
                      className="w-full p-3 border rounded-lg text-sm" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                  </div>
                </div>
                <button type="submit" disabled={submitting || isPending}
                  className="w-full py-3 text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ backgroundColor: isPending ? "#f59e0b" : "var(--primary)" }}>
                  {isPending ? <><Clock size={16} /> Awaiting Review</> : submitting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</> : <><Send size={16} /> Submit for Verification</>}
                </button>
              </form>
            </>
          )}

          {/* Verified Features */}
          {isApproved && (
            <div className="rounded-xl border p-6 mt-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="font-bold mb-3" style={{ color: "var(--text-primary)" }}>🎉 Unlocked Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Link href={"/" + lang + "/dashboard/editor"} className="p-4 rounded-lg border flex items-center gap-3 hover:shadow-md transition-all"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
                  <FileText size={20} style={{ color: "var(--primary)" }} />
                  <div><p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>Create Documents</p><p className="text-xs" style={{ color: "var(--text-secondary)" }}>Unlimited documents</p></div>
                </Link>
                <Link href={"/" + lang + "/dashboard/ads"} className="p-4 rounded-lg border flex items-center gap-3 hover:shadow-md transition-all"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
                  <FileText size={20} style={{ color: "var(--success)" }} />
                  <div><p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>Submit Ads</p><p className="text-xs" style={{ color: "var(--text-secondary)" }}>Advertise your business</p></div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
