// Payment Processor — Production Ready

import { PAYMENT_CONFIG, PACKAGES } from './config';

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  redirectUrl?: string;
}

interface PackagePurchase {
  userId: number;
  packageId: string;
  amount: number;
  currency: string;
  paymentMethod: 'stripe' | 'paypal' | 'manual';
}

// Stripe Payment
export async function processStripePayment(purchase: PackagePurchase): Promise<PaymentResult> {
  try {
    const Stripe = require('stripe');
    const stripe = new Stripe(PAYMENT_CONFIG.stripe.secretKey);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: PAYMENT_CONFIG.currency,
          product_data: {
            name: `${purchase.packageId.toUpperCase()} Plan`,
            description: `Centre.com.pk ${purchase.packageId} subscription`,
          },
          unit_amount: Math.round(purchase.amount * 100),
        },
        quantity: 1,
      }],
      mode: purchase.amount > 0 ? 'payment' : 'setup',
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/plan?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/plan?payment=cancelled`,
      metadata: {
        userId: purchase.userId.toString(),
        packageId: purchase.packageId,
      },
    });

    return {
      success: true,
      transactionId: session.id,
      redirectUrl: session.url || undefined,
    };
  } catch (error: any) {
    console.error('Stripe error:', error);
    return { success: false, error: error.message };
  }
}

// PayPal Payment
export async function processPayPalPayment(purchase: PackagePurchase): Promise<PaymentResult> {
  try {
    const response = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${PAYMENT_CONFIG.paypal.clientId}:${PAYMENT_CONFIG.paypal.secret}`).toString('base64')}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: PAYMENT_CONFIG.currency.toUpperCase(),
            value: purchase.amount.toFixed(2),
          },
          description: `Centre.com.pk ${purchase.packageId} Plan`,
        }],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/plan?payment=success`,
          cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/plan?payment=cancelled`,
        },
      }),
    });

    const data = await response.json();

    if (data.status === 'CREATED') {
      const approveUrl = data.links?.find((l: any) => l.rel === 'approve')?.href;
      return {
        success: true,
        transactionId: data.id,
        redirectUrl: approveUrl,
      };
    }

    return { success: false, error: 'PayPal order creation failed' };
  } catch (error: any) {
    console.error('PayPal error:', error);
    return { success: false, error: error.message };
  }
}

// Manual Payment (Bank Transfer, Easypaisa, JazzCash)
export async function processManualPayment(purchase: PackagePurchase): Promise<PaymentResult> {
  // Generate unique reference
  const ref = `CENTERS-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  return {
    success: true,
    transactionId: ref,
    redirectUrl: `${process.env.NEXT_PUBLIC_URL}/dashboard/plan?payment=pending&ref=${ref}`,
  };
}

// Get package by ID
export function getPackageById(packageId: string) {
  return PACKAGES.find(p => p.id === packageId) || PACKAGES[0];
}

// Calculate expiry date
export function calculateExpiry(durationDays: number): string | null {
  if (durationDays === 0) return null; // Lifetime
  const date = new Date();
  date.setDate(date.getDate() + durationDays);
  return date.toISOString();
}

// Check if user can access feature
export function canAccess(userPlan: string, requiredPlan: string): boolean {
  const planOrder = ['free', 'pro', 'premium', 'lifetime'];
  const userIndex = planOrder.indexOf(userPlan);
  const requiredIndex = planOrder.indexOf(requiredPlan);
  return userIndex >= requiredIndex;
}
