// components/payment/PricingCards.tsx
'use client';

import { useState } from 'react';
import { Check, Crown, Zap, Star, Infinity } from 'lucide-react';
import { useTheme } from '@/components/theme';
import { useParams, useRouter } from 'next/navigation';

interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  pkrMonthly: number;
  pkrYearly: number;
  icon: any;
  color: string;
  features: string[];
  cta: string;
  popular: boolean;
  badge?: string;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    pkrMonthly: 0,
    pkrYearly: 0,
    icon: Zap,
    color: 'gray',
    features: [
      '5 cards per day',
      '24-hour card expiry',
      '8 card themes',
      'Basic templates',
      'centre.com.pk watermark',
      'Standard quality download',
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 4.99,
    yearlyPrice: 49.99,
    pkrMonthly: 1400,
    pkrYearly: 14000,
    icon: Star,
    color: 'blue',
    features: [
      '100 cards per day',
      '30-day card expiry',
      '20+ card themes',
      'HD quality download',
      'No watermark',
      'Animated cards',
      'Birthday reminders (1)',
      'Priority support',
    ],
    cta: 'Go Pro',
    popular: true,
    badge: 'MOST POPULAR',
  },
  {
    id: 'premium',
    name: 'Premium',
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    pkrMonthly: 2800,
    pkrYearly: 28000,
    icon: Crown,
    color: 'purple',
    features: [
      'Unlimited cards',
      'Permanent card links',
      '50+ card themes',
      'Ultra HD download (4K)',
      'Custom templates',
      'Birthday reminders (5)',
      'Life Analytics Dashboard',
      'Remove all ads',
      'VIP support',
    ],
    cta: 'Go Premium',
    popular: false,
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    monthlyPrice: 99.99,
    yearlyPrice: 99.99,
    pkrMonthly: 28000,
    pkrYearly: 28000,
    icon: Infinity,
    color: 'amber',
    features: [
      'Everything in Premium',
      'One-time payment',
      'Lifetime access',
      'All future features free',
      'Early access to new tools',
      'Founder badge',
      'Priority support forever',
    ],
    cta: 'Get Lifetime',
    popular: false,
    badge: 'BEST VALUE',
  },
];

export default function PricingCards() {
  const { themeColors } = useTheme();
  const params = useParams();
  const router = useRouter();
  const lang = (params?.lang as string) || 'en';
  
  const [yearly, setYearly] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [hoveredPlanId, setHoveredPlanId] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);

    if (planId === 'free') {
      router.push(`/${lang}/auth/signup`);
      return;
    }

    const selectedPlan = PLANS.find(p => p.id === planId);
    localStorage.setItem('selected_plan', JSON.stringify({
      plan: planId,
      yearly,
      name: selectedPlan?.name,
      price: yearly ? selectedPlan?.yearlyPrice : selectedPlan?.monthlyPrice,
      pkr: yearly ? selectedPlan?.pkrYearly : selectedPlan?.pkrMonthly,
    }));

    window.dispatchEvent(new CustomEvent('plan-selected', {
      detail: { plan: planId, yearly }
    }));

    const paymentSection = document.getElementById('payment-section');
    if (paymentSection) {
      paymentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getPrice = (plan: Plan) => {
    if (plan.id === 'lifetime') return plan.monthlyPrice;
    return yearly ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getPkrPrice = (plan: Plan) => {
    if (plan.id === 'lifetime') return plan.pkrMonthly;
    return yearly ? plan.pkrYearly : plan.pkrMonthly;
  };

  const getSavings = (plan: Plan) => {
    if (plan.id === 'free' || plan.id === 'lifetime') return null;
    const monthlyTotal = plan.monthlyPrice * 12;
    const savings = monthlyTotal - plan.yearlyPrice;
    const percent = Math.round((savings / monthlyTotal) * 100);
    return { amount: savings, percent };
  };

  return (
    <div className="space-y-8">
      {/* Toggle */}
      <div className="flex justify-center">
        <div 
          className="flex items-center gap-1 p-1 rounded-xl"
          style={{ backgroundColor: themeColors.surface, border: `1px solid ${themeColors.border}` }}
        >
          <button
            onClick={() => setYearly(false)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              !yearly 
                ? 'bg-primary text-white shadow-md shadow-primary/20' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              yearly 
                ? 'bg-primary text-white shadow-md shadow-primary/20' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Yearly
            <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-bold">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selectedPlanId === plan.id;
          const isHovered = hoveredPlanId === plan.id;
          const price = getPrice(plan);
          const pkrPrice = getPkrPrice(plan);
          const savings = getSavings(plan);
          const isFree = plan.id === 'free';

          return (
            <div
              key={plan.id}
              onClick={() => handleSelectPlan(plan.id)}
              onMouseEnter={() => setHoveredPlanId(plan.id)}
              onMouseLeave={() => setHoveredPlanId(null)}
              className={`relative rounded-2xl border-2 p-6 flex flex-col transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'border-primary shadow-xl shadow-primary/10 scale-[1.02] ring-2 ring-primary/20'
                  : isHovered
                  ? 'border-primary/50 shadow-lg -translate-y-1'
                  : 'border-border shadow-sm'
              }`}
              style={{ backgroundColor: themeColors.surface }}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 text-white text-xs font-bold rounded-full whitespace-nowrap shadow-lg ${
                  plan.color === 'blue' ? 'bg-blue-600' :
                  plan.color === 'purple' ? 'bg-purple-600' : 'bg-amber-500'
                }`}>
                  {plan.badge}
                </div>
              )}

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6 pt-2">
                <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center transition-transform duration-300 ${
                  isSelected ? 'scale-110' : ''
                } ${
                  plan.color === 'blue' ? 'bg-blue-100' :
                  plan.color === 'purple' ? 'bg-purple-100' :
                  plan.color === 'amber' ? 'bg-amber-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-7 h-7 ${
                    plan.color === 'blue' ? 'text-blue-600' :
                    plan.color === 'purple' ? 'text-purple-600' :
                    plan.color === 'amber' ? 'text-amber-600' : 'text-gray-600'
                  }`} />
                </div>
                <h3 className="text-xl font-bold" style={{ color: themeColors.text.primary }}>
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mt-3">
                  {isFree ? (
                    <div className="text-4xl font-black" style={{ color: themeColors.text.primary }}>Free</div>
                  ) : (
                    <>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-lg font-medium" style={{ color: themeColors.text.secondary }}>$</span>
                        <span className="text-5xl font-black" style={{ color: themeColors.text.primary }}>
                          {price}
                        </span>
                        {plan.id !== 'lifetime' && (
                          <span className="text-sm" style={{ color: themeColors.text.secondary }}>
                            /{yearly ? 'yr' : 'mo'}
                          </span>
                        )}
                      </div>
                      {plan.id !== 'lifetime' && (
                        <div className="text-sm mt-1" style={{ color: themeColors.text.secondary }}>
                          PKR {pkrPrice.toLocaleString()}/{yearly ? 'year' : 'month'}
                        </div>
                      )}
                      {plan.id === 'lifetime' && (
                        <div className="text-sm mt-1" style={{ color: themeColors.text.secondary }}>
                          PKR {pkrPrice.toLocaleString()} one-time
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Savings Badge */}
                {savings && yearly && (
                  <div className="mt-2 inline-block px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    Save ${savings.amount} ({savings.percent}%)
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: themeColors.text.secondary }}>
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPlan(plan.id);
                }}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  isSelected
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : isFree
                    ? 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                    : 'border-2 border-border text-text-secondary hover:border-primary hover:text-primary'
                }`}
              >
                {isSelected ? 'Selected ✓' : plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      {/* Enterprise Contact */}
      <div 
        className="text-center mt-8 p-6 rounded-2xl border border-border"
        style={{ backgroundColor: themeColors.surface }}
      >
        <p className="text-text-secondary text-sm">
          💡 <strong>Need something custom?</strong> Contact us for enterprise pricing, bulk discounts, or white-label solutions.
        </p>
        <a 
          href="mailto:support@centre.com.pk" 
          className="text-primary font-medium text-sm hover:underline mt-1 inline-block"
        >
          Contact Sales →
        </a>
      </div>
    </div>
  );
}