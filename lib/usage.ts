interface UsageRecord {
  userId?: string
  sessionId: string
  conversions: number
  lastReset: Date
  plan: string
}

// Simple in-memory storage (use Redis/Database in production)
const usageStore = new Map<string, UsageRecord>()

export class UsageTracker {
  private static instance: UsageTracker
  
  static getInstance(): UsageTracker {
    if (!UsageTracker.instance) {
      UsageTracker.instance = new UsageTracker()
    }
    return UsageTracker.instance
  }

  private getKey(userId?: string, sessionId?: string): string {
    return userId || sessionId || 'anonymous'
  }

  async getUsage(userId?: string, sessionId?: string): Promise<UsageRecord> {
    const key = this.getKey(userId, sessionId)
    const existing = usageStore.get(key)
    
    if (!existing) {
      const newRecord: UsageRecord = {
        userId,
        sessionId: sessionId || 'anonymous',
        conversions: 0,
        lastReset: new Date(),
        plan: userId ? 'free' : 'free'
      }
      usageStore.set(key, newRecord)
      return newRecord
    }
    
    // Reset daily usage for free users
    if (existing.plan === 'free' && this.shouldResetDaily(existing.lastReset)) {
      existing.conversions = 0
      existing.lastReset = new Date()
      usageStore.set(key, existing)
    }
    
    return existing
  }

  async incrementUsage(userId?: string, sessionId?: string): Promise<boolean> {
    const usage = await this.getUsage(userId, sessionId)
    const key = this.getKey(userId, sessionId)
    
    // Check limits
    const { PRICING_PLANS } = await import('./pricing')
    const plan = PRICING_PLANS[usage.plan]
    
    if (plan.limits.conversions !== -1 && usage.conversions >= plan.limits.conversions) {
      return false // Limit exceeded
    }
    
    usage.conversions++
    usageStore.set(key, usage)
    return true
  }

  async canConvert(userId?: string, sessionId?: string): Promise<{ allowed: boolean; remaining: number; plan: string }> {
    const usage = await this.getUsage(userId, sessionId)
    const { PRICING_PLANS } = await import('./pricing')
    const plan = PRICING_PLANS[usage.plan]
    
    const allowed = plan.limits.conversions === -1 || usage.conversions < plan.limits.conversions
    const remaining = plan.limits.conversions === -1 ? -1 : Math.max(0, plan.limits.conversions - usage.conversions)
    
    return {
      allowed,
      remaining,
      plan: usage.plan
    }
  }

  async updatePlan(userId: string, newPlan: string): Promise<void> {
    const usage = await this.getUsage(userId)
    usage.plan = newPlan
    usage.conversions = 0 // Reset usage when upgrading
    usage.lastReset = new Date()
    usageStore.set(userId, usage)
  }

  private shouldResetDaily(lastReset: Date): boolean {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - lastReset.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays >= 1
  }

  // Get usage stats for admin
  async getStats(): Promise<{ totalUsers: number; totalConversions: number; planDistribution: Record<string, number> }> {
    const stats = {
      totalUsers: usageStore.size,
      totalConversions: 0,
      planDistribution: {} as Record<string, number>
    }
    
    for (const usage of usageStore.values()) {
      stats.totalConversions += usage.conversions
      stats.planDistribution[usage.plan] = (stats.planDistribution[usage.plan] || 0) + 1
    }
    
    return stats
  }
}
