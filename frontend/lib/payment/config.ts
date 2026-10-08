// Payment Configuration — Production Ready

export const PAYMENT_CONFIG = {
  stripe: {
    publicKey: process.env.NEXT_PUBLIC_STRIPE_KEY || '',
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
  paypal: {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
    secret: process.env.PAYPAL_SECRET || '',
  },
  currency: 'usd',
  currencySymbol: '$',
  taxRate: 0, // 0% tax for now
};

// Package pricing
export const PACKAGES = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    durationDays: 0,
    features: ['10 Documents', 'Basic Tools', 'Ads Shown', 'Community Support'],
    popular: false,
    color: '#64748b'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    durationDays: 30,
    features: ['Unlimited Documents', 'All Tools', 'No Ads', 'Priority Support', 'API Access (100 req/day)'],
    popular: true,
    color: '#3b82f6'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 29.99,
    durationDays: 90,
    features: ['Everything in Pro', 'Affiliate Access', 'Early Features', 'Custom Domain', 'API Access (1000 req/day)', 'Advanced SEO Tools'],
    popular: false,
    color: '#8b5cf6'
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: 99.99,
    durationDays: 0,
    features: ['Everything in Premium', 'Lifetime Access', 'VIP Support', 'All Future Updates', 'Unlimited API', 'White Label Option'],
    popular: false,
    color: '#f59e0b'
  }
];

// Ad spaces for direct sale
export const AD_SPACES = [
  { id: 'header', name: 'Header Banner (728x90)', price: 199, location: 'Top of all pages', views: 'Thousands/month' },
  { id: 'sidebar', name: 'Sidebar (300x600)', price: 149, location: 'Right sidebar', views: '30k+/month' },
  { id: 'in-content', name: 'In-Content (728x90)', price: 99, location: 'Inside tool pages', views: '20k+/month' },
  { id: 'tool-sponsor', name: 'Tool Sponsor', price: 249, location: 'Specific tool page', views: '10k+/month' },
  { id: 'footer', name: 'Footer Banner (728x90)', price: 79, location: 'Bottom of pages', views: '40k+/month' },
];
