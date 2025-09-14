export interface PricingPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  limits: {
    conversions: number
    fileSize: number // MB
    batchSize: number
    creativeEffects: boolean
    watermarkRemoval: boolean
    apiAccess: boolean
  }
}

export const PRICING_PLANS: Record<string, PricingPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      '5 conversions per day',
      'Basic formats (PNG, JPG)',
      '10MB file size limit',
      'Watermarked outputs'
    ],
    limits: {
      conversions: 5,
      fileSize: 10,
      batchSize: 1,
      creativeEffects: false,
      watermarkRemoval: false,
      apiAccess: false
    }
  },
  
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    interval: 'month',
    features: [
      '500 conversions per month',
      'All formats (PNG, JPG, WebP, AVIF)',
      '50MB file size limit',
      'Creative effects & filters',
      'Batch processing (10 files)',
      'No watermarks',
      'Priority support'
    ],
    limits: {
      conversions: 500,
      fileSize: 50,
      batchSize: 10,
      creativeEffects: true,
      watermarkRemoval: true,
      apiAccess: false
    }
  },
  
  business: {
    id: 'business',
    name: 'Business',
    price: 29.99,
    interval: 'month',
    features: [
      'Unlimited conversions',
      'All formats + RAW support',
      '200MB file size limit',
      'All creative tools',
      'Batch processing (100 files)',
      'Custom watermarks',
      'API access',
      'Priority support',
      'Team collaboration'
    ],
    limits: {
      conversions: -1, // unlimited
      fileSize: 200,
      batchSize: 100,
      creativeEffects: true,
      watermarkRemoval: true,
      apiAccess: true
    }
  }
}

export function getPlan(planId: string): PricingPlan {
  return PRICING_PLANS[planId] || PRICING_PLANS.free
}

export function canUseFeature(userPlan: string, feature: keyof PricingPlan['limits']): boolean {
  const plan = getPlan(userPlan)
  return plan.limits[feature] === true || plan.limits[feature] === -1
}

export function getRemainingUsage(userPlan: string, currentUsage: number): number {
  const plan = getPlan(userPlan)
  if (plan.limits.conversions === -1) return -1 // unlimited
  return Math.max(0, plan.limits.conversions - currentUsage)
}
