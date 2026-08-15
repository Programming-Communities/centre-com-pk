'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useParams } from 'next/navigation';
import { Crown, Check, Zap, Building, Shield, CreditCard, Smartphone, Building2, ArrowRight, Clock, CheckCircle, XCircle, Upload } from 'lucide-react';

export default function PlanClient() {
  const { lang } = useParams() as { lang: string };
  const { themeColors, isDarkMode } = useTheme();
  const [packages, setPackages] = useState<any[]>([]);
  const [methods, setMethods] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [user, setUser] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'plans' | 'history'>('plans');

  const textPrimary = themeColors.text?.primary || '#0f172a';
  const textSecondary = themeColors.text?.secondary || '#64748b';
  const border = themeColors.border || '#e2e8f0';
  const surface = themeColors.surface || '#ffffff';
  const primary = themeColors.primary || '#3b82f6';

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const u = JSON.parse(userData);
        setUser(u);
        setCurrentPlan(u.plan || 'free');
      } catch {}
    }
    
    Promise.all([
      fetch('/api/payments?action=packages').then(r => r.json()),
      fetch('/api/payments?action=methods').then(r => r.json()),
    ]).then(([pkgData, methodData]) => {
      setPackages(pkgData.packages || []);
      setMethods(methodData.methods || []);
      if (methodData.methods?.length > 0) setPaymentMethod(methodData.methods[0].type);
      setLoading(false);
    });

    // Load payment history if user
    if (user?.id) {
      fetch('/api/payments?action=history&user_id=' + user.id)
        .then(r => r.json())
        .then(d => setPayments(d.payments || []));
    }
  }, []);

  const handleUpgrade = (pkg: any) => {
    if (pkg.price === 0) return;
    setSelectedPackage(pkg);
    setShowPayment(true);
    setTransactionId('');
    setProofUrl('');
    setSuccess(false);
  };

  const handlePayment = async () => {
    if (!selectedPackage || !user || !paymentMethod) return;
    setSubmitting(true);
    
    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'submit_payment',
        user_id: user.id,
        user_email: user.email,
        user_name: user.name,
        package_id: selectedPackage.id,
        package_name: selectedPackage.name,
        amount: selectedPackage.price,
        payment_method: paymentMethod,
        transaction_id: transactionId,
        proof_url: proofUrl,
      }),
    });
    
    const data = await res.json();
    setSubmitting(false);
    
    if (data.success) {
      setSuccess(true);
      setTimeout(() => {
        setShowPayment(false);
        setSuccess(false);
      }, 3000);
    }
  };

  const getMethodIcon = (type: string) => {
    if (type === 'jazzcash' || type === 'easypaisa') return Smartphone;
    if (type === 'bank_transfer') return Building2;
    return CreditCard;
  };

  const statusConfig: Record<string, any> = {
    pending: { bg: '#f59e0b15', color: '#f59e0b', icon: Clock, label: 'Pending' },
    completed: { bg: '#10b98115', color: '#10b981', icon: CheckCircle, label: 'Approved' },
    failed: { bg: '#ef444415', color: '#ef4444', icon: XCircle, label: 'Failed' },
  };

  const iconMap: Record<number, any> = { 0: Zap, 1: Crown, 2: Building };

  return (
    <div style={{ fontFamily: themeColors.fontFamily }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: textPrimary, margin: '0 0 4px' }}>
          💎 My Plan
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '14px', color: textSecondary }}>
            Current: <span style={{ color: primary, fontWeight: 700, textTransform: 'uppercase', background: primary + '15', padding: '3px 12px', borderRadius: '12px' }}>{currentPlan}</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid ' + border, paddingBottom: '12px' }}>
        {[
          { id: 'plans', label: '📦 Plans' },
          { id: 'history', label: '📋 Payment History' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: activeTab === tab.id ? primary : 'transparent', color: activeTab === tab.id ? '#fff' : textSecondary, fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* PLANS TAB */}
      {activeTab === 'plans' && (
        <>
          {loading ? (
            <p style={{ color: textSecondary }}>Loading plans...</p>
          ) : packages.length === 0 ? (
            <p style={{ color: textSecondary }}>No plans available.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {packages.map((pkg: any) => {
                const Icon = iconMap[pkg.id] || Zap;
                const isCurrent = pkg.name?.toLowerCase() === currentPlan?.toLowerCase();
                const isPopular = pkg.is_popular === 1;
                const features = JSON.parse(pkg.features || '[]');
                
                return (
                  <div key={pkg.id} style={{
                    padding: '30px 24px', background: surface, borderRadius: '16px',
                    border: isCurrent ? '2px solid ' + primary : isPopular ? '2px solid ' + primary + '50' : '1px solid ' + border,
                    position: 'relative',
                    boxShadow: isCurrent ? '0 8px 30px ' + primary + '15' : isPopular ? '0 4px 20px rgba(0,0,0,0.06)' : '0 2px 8px rgba(0,0,0,0.04)',
                    transform: isPopular ? 'scale(1.02)' : 'none'
                  }}>
                    {isCurrent && (
                      <div style={{ position: 'absolute', top: '-12px', right: '20px', padding: '4px 14px', background: '#10b981', color: '#fff', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                        ✅ Current Plan
                      </div>
                    )}
                    {isPopular && !isCurrent && (
                      <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', padding: '4px 14px', background: primary, color: '#fff', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                        ⭐ Most Popular
                      </div>
                    )}
                    
                    <Icon size={30} color={primary} style={{ marginBottom: '14px' }} />
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: textPrimary, marginBottom: '4px' }}>{pkg.name}</h3>
                    <p style={{ fontSize: '13px', color: textSecondary, marginBottom: '18px' }}>{pkg.description}</p>
                    
                    <div style={{ marginBottom: '20px' }}>
                      {pkg.original_price > pkg.price && (
                        <span style={{ fontSize: '15px', color: textSecondary, textDecoration: 'line-through', marginRight: '8px' }}>
                          {pkg.currency} {pkg.original_price}
                        </span>
                      )}
                      <span style={{ fontSize: '36px', fontWeight: 800, color: textPrimary }}>
                        {pkg.price === 0 ? 'FREE' : pkg.currency + ' ' + pkg.price}
                      </span>
                      {pkg.price > 0 && <span style={{ fontSize: '13px', color: textSecondary }}>/{pkg.duration_days}d</span>}
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      {features.map((f: string, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', fontSize: '13px', color: textPrimary }}>
                          <Check size={15} color="#10b981" /> {f}
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => handleUpgrade(pkg)}
                      disabled={isCurrent || pkg.price === 0}
                      style={{
                        width: '100%', padding: '14px', borderRadius: '10px',
                        border: isCurrent ? '1px solid ' + border : 'none',
                        background: isCurrent ? surface : isPopular ? primary : primary + '90',
                        color: isCurrent ? textSecondary : '#fff',
                        fontWeight: 700, cursor: isCurrent ? 'default' : 'pointer',
                        fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                      }}>
                      {isCurrent ? 'Current Plan' : pkg.price === 0 ? 'Free Forever' : <>{'Upgrade to ' + pkg.name} <ArrowRight size={16} /></>}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <>
          {payments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: textSecondary }}>
              <CreditCard size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
              <p>No payment history yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {payments.map((p: any) => {
                const sc = statusConfig[p.status] || statusConfig.pending;
                const StatusIcon = sc.icon;
                return (
                  <div key={p.id} style={{ padding: '16px', background: surface, borderRadius: '10px', border: '1px solid ' + border, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: textPrimary, fontSize: '14px' }}>{p.package_name} Plan</div>
                      <div style={{ fontSize: '12px', color: textSecondary }}>
                        {p.currency} {p.amount} • {p.payment_method} • {new Date(p.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <span style={{ padding: '4px 12px', borderRadius: '14px', fontSize: '11px', fontWeight: 600, background: sc.bg, color: sc.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <StatusIcon size={12} /> {sc.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* PAYMENT MODAL */}
      {showPayment && selectedPackage && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }} onClick={() => setShowPayment(false)}>
          <div style={{ background: surface, borderRadius: '16px', padding: '30px', maxWidth: '480px', width: '90%', border: '1px solid ' + border, maxHeight: '80vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            
            {success ? (
              <div style={{ textAlign: 'center', padding: '30px' }}>
                <CheckCircle size={56} color="#10b981" style={{ marginBottom: '16px' }} />
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: textPrimary, marginBottom: '8px' }}>✅ Payment Submitted!</h2>
                <p style={{ fontSize: '14px', color: textSecondary }}>Admin will verify and activate your plan within 24 hours.</p>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: textPrimary, marginBottom: '6px' }}>💳 Complete Payment</h2>
                <p style={{ fontSize: '14px', color: textSecondary, marginBottom: '20px' }}>
                  <strong>{selectedPackage.name}</strong> Plan — <strong style={{ color: primary, fontSize: '18px' }}>{selectedPackage.currency} {selectedPackage.price}</strong>
                </p>

                {/* Payment Methods */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {methods.map((m: any) => {
                    const MIcon = getMethodIcon(m.type);
                    return (
                      <button key={m.id} onClick={() => setPaymentMethod(m.type)}
                        style={{
                          padding: '14px', borderRadius: '10px',
                          border: '2px solid ' + (paymentMethod === m.type ? primary : border),
                          background: paymentMethod === m.type ? primary + '08' : 'transparent',
                          cursor: 'pointer', textAlign: 'left',
                          display: 'flex', alignItems: 'center', gap: '12px'
                        }}>
                        <MIcon size={20} color={paymentMethod === m.type ? primary : textSecondary} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, color: textPrimary, fontSize: '14px' }}>{m.name}</div>
                          <div style={{ fontSize: '11px', color: textSecondary }}>{m.account_number} — {m.account_title}</div>
                        </div>
                        {paymentMethod === m.type && <CheckCircle size={18} color={primary} />}
                      </button>
                    );
                  })}
                </div>

                {/* Transaction ID */}
                <input type="text" placeholder="Transaction ID (optional)" value={transactionId} onChange={e => setTransactionId(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid ' + border, marginBottom: '10px', fontSize: '13px', background: 'transparent', color: textPrimary, boxSizing: 'border-box' }} />

                {/* Proof URL */}
                <input type="text" placeholder="Screenshot/Proof URL (optional)" value={proofUrl} onChange={e => setProofUrl(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid ' + border, marginBottom: '20px', fontSize: '13px', background: 'transparent', color: textPrimary, boxSizing: 'border-box' }} />

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handlePayment} disabled={submitting || !paymentMethod}
                    style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: '#10b981', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '15px', opacity: submitting ? 0.7 : 1 }}>
                    {submitting ? '⏳ Submitting...' : '✅ Confirm Payment'}
                  </button>
                  <button onClick={() => setShowPayment(false)}
                    style={{ padding: '14px 20px', borderRadius: '10px', border: '1px solid ' + border, background: 'transparent', color: textSecondary, fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
