"use client"

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Crown, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface UsageInfo {
  plan: 'FREE' | 'PRO'
  remainingConversions: number
  resetTime?: string
}

interface UsageIndicatorProps {
  usageInfo?: UsageInfo
  onUpgrade?: () => void
}

export default function UsageIndicator({ usageInfo, onUpgrade }: UsageIndicatorProps) {
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Don't show for loading states
  if (status === 'loading') return null

  // Default values for anonymous users
  const plan = usageInfo?.plan || 'FREE'
  const remainingConversions = usageInfo?.remainingConversions ?? (session ? 5 : 0)
  const dailyLimit = plan === 'PRO' ? 1000 : 5
  const usedConversions = dailyLimit - remainingConversions
  const usagePercentage = (usedConversions / dailyLimit) * 100

  const isPro = plan === 'PRO'
  const isLoggedIn = !!session

  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isPro ? (
              <Crown className="w-5 h-5 text-yellow-500" />
            ) : (
              <Zap className="w-5 h-5 text-blue-500" />
            )}
            <span className="font-semibold">{plan} Plan</span>
            {isPro && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                Pro
              </Badge>
            )}
          </div>
          {!isPro && (
            <Link href="/pricing">
              <Button size="sm" variant="outline" className="text-xs">
                Upgrade
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          )}
        </div>

        {isLoggedIn ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Daily conversions</span>
              <span className="font-medium">
                {usedConversions} / {dailyLimit}
              </span>
            </div>
            <Progress 
              value={usagePercentage} 
              className="h-2"
            />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {remainingConversions} conversions remaining today
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sign in to track your usage and get 5 free conversions daily
            </p>
            <div className="flex gap-2">
              <Link href="/auth/signin">
                <Button size="sm" variant="outline" className="text-xs">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="text-xs bg-gradient-to-r from-blue-600 to-indigo-600">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
