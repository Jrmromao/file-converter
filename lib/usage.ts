import { prisma } from './prisma'
import { PRICING_PLANS } from './stripe'

export class UsageService {
  private static instance: UsageService
  
  static getInstance(): UsageService {
    if (!UsageService.instance) {
      UsageService.instance = new UsageService()
    }
    return UsageService.instance
  }

  async checkUsageLimit(userId: string | null): Promise<{
    canConvert: boolean
    remainingConversions: number
    plan: 'FREE' | 'PRO'
    resetTime?: Date
  }> {
    if (!userId) {
      // Anonymous user - no tracking, just deny
      return {
        canConvert: false,
        remainingConversions: 0,
        plan: 'FREE'
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isPro: true }
    })

    const plan = user?.isPro ? 'PRO' : 'FREE'
    const dailyLimit = PRICING_PLANS[plan].dailyConversions

    // Get today's conversions
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayConversions = await prisma.conversion.count({
      where: {
        userId,
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    const remainingConversions = Math.max(0, dailyLimit - todayConversions)
    
    return {
      canConvert: remainingConversions > 0,
      remainingConversions,
      plan,
      resetTime: tomorrow
    }
  }

  async recordConversion(
    userId: string | null,
    originalFormat: string,
    targetFormat: string,
    fileSize: number,
    processingTime: number,
    aiFeatures: boolean = false
  ): Promise<void> {
    if (!userId) return

    await prisma.conversion.create({
      data: {
        userId,
        originalFormat,
        targetFormat,
        fileSize,
        processingTime,
        aiFeatures
      }
    })
  }

  async getUserStats(userId: string): Promise<{
    totalConversions: number
    todayConversions: number
    averageFileSize: number
    mostUsedFormat: string
  }> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [totalConversions, todayConversions, avgFileSize, formatStats] = await Promise.all([
      prisma.conversion.count({
        where: { userId }
      }),
      prisma.conversion.count({
        where: {
          userId,
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      prisma.conversion.aggregate({
        where: { userId },
        _avg: { fileSize: true }
      }),
      prisma.conversion.groupBy({
        by: ['targetFormat'],
        where: { userId },
        _count: { targetFormat: true },
        orderBy: { _count: { targetFormat: 'desc' } },
        take: 1
      })
    ])

    return {
      totalConversions,
      todayConversions,
      averageFileSize: Math.round(avgFileSize._avg.fileSize || 0),
      mostUsedFormat: formatStats[0]?.targetFormat || 'png'
    }
  }
}
