import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
})

export const PRICING_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    dailyConversions: 5,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    features: [
      '5 conversions per day',
      'Basic formats (PNG, JPG, WebP)',
      '5MB max file size',
      'Standard processing'
    ]
  },
  PRO: {
    name: 'Pro',
    price: 9.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    dailyConversions: 1000,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    features: [
      '1,000 conversions per day',
      'All formats (PNG, JPG, WebP, AVIF)',
      '50MB max file size',
      'Priority processing',
      'Batch processing',
      'API access'
    ]
  }
} as const

export type PricingPlan = keyof typeof PRICING_PLANS
