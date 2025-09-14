"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Zap, Crown, Building2, ArrowRight } from 'lucide-react'
import { PRICING_PLANS } from '@/lib/pricing'

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)

  const handleUpgrade = (planId: string) => {
    // Redirect to payment or show upgrade modal
    window.location.href = `/upgrade?plan=${planId}&interval=${isYearly ? 'yearly' : 'monthly'}`
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return <Zap className="w-6 h-6 text-green-600" />
      case 'pro': return <Crown className="w-6 h-6 text-blue-600" />
      case 'business': return <Building2 className="w-6 h-6 text-purple-600" />
      default: return <Zap className="w-6 h-6" />
    }
  }

  const getPrice = (plan: typeof PRICING_PLANS.free) => {
    if (plan.price === 0) return 'Free'
    const price = isYearly ? plan.price * 10 : plan.price // 2 months free yearly
    return `$${price}${isYearly ? '/year' : '/month'}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Start free, upgrade when you need more power. No hidden fees, cancel anytime.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isYearly ? 'font-semibold' : 'text-gray-500'}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isYearly ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isYearly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isYearly ? 'font-semibold' : 'text-gray-500'}`}>
              Yearly
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                Save 17%
              </Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {Object.entries(PRICING_PLANS).map(([planId, plan]) => (
            <Card 
              key={planId} 
              className={`relative ${
                planId === 'pro' 
                  ? 'border-2 border-blue-500 shadow-xl scale-105' 
                  : 'border border-gray-200 dark:border-gray-700'
              }`}
            >
              {planId === 'pro' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  {getPlanIcon(planId)}
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
                  {getPrice(plan)}
                </div>
                {plan.price > 0 && (
                  <p className="text-sm text-gray-500">
                    {isYearly ? 'Billed annually' : 'Billed monthly'}
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                {/* CTA Button */}
                <Button
                  onClick={() => handleUpgrade(planId)}
                  className={`w-full ${
                    planId === 'free'
                      ? 'bg-gray-600 hover:bg-gray-700'
                      : planId === 'pro'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                  size="lg"
                >
                  {planId === 'free' ? 'Get Started' : 'Upgrade Now'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold mb-2">What happens if I exceed my limits?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                You'll be prompted to upgrade your plan. We never charge overage fees without your consent.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our Free plan lets you try all basic features. Pro and Business plans come with a 7-day money-back guarantee.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! We offer a 7-day money-back guarantee on all paid plans, no questions asked.
              </p>
            </div>
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Need Something Custom?</h2>
            <p className="text-xl mb-6 opacity-90">
              Enterprise solutions with custom integrations, dedicated support, and volume pricing.
            </p>
            {/* <Button 
              variant="secondary" 
              size="lg"
              onClick={() => window.location.href = '/contact?type=enterprise'}
            >
              Contact Sales
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  )
}
