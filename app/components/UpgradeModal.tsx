"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Check, Crown, Zap, X, ArrowRight } from 'lucide-react'
import { PRICING_PLANS } from '@/lib/pricing'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan?: string
  reason?: string
  feature?: string
}

export default function UpgradeModal({ 
  isOpen, 
  onClose, 
  currentPlan = 'free',
  reason = 'Unlock more features',
  feature 
}: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState('pro')

  const handleUpgrade = () => {
    // Redirect to payment
    window.location.href = `/upgrade?plan=${selectedPlan}&from=${currentPlan}`
  }

  const getReasonMessage = () => {
    if (feature) {
      return `${feature} requires a Pro plan or higher`
    }
    return reason
  }

  const getRecommendedPlan = () => {
    if (currentPlan === 'free') return 'pro'
    return 'business'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Crown className="w-6 h-6 text-blue-600" />
              Upgrade Your Plan
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {getReasonMessage()}
          </p>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Pro Plan */}
          <Card 
            className={`cursor-pointer transition-all ${
              selectedPlan === 'pro' 
                ? 'border-2 border-blue-500 shadow-lg' 
                : 'border border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setSelectedPlan('pro')}
          >
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-2">
                <Crown className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-bold">Pro Plan</CardTitle>
              <div className="text-3xl font-extrabold text-blue-600">
                $9.99<span className="text-sm font-normal text-gray-500">/month</span>
              </div>
              <Badge className="bg-blue-100 text-blue-700 w-fit mx-auto">
                Most Popular
              </Badge>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-2 mb-6">
                {PRICING_PLANS.pro.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {selectedPlan === 'pro' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    Perfect for content creators and small businesses
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Business Plan */}
          <Card 
            className={`cursor-pointer transition-all ${
              selectedPlan === 'business' 
                ? 'border-2 border-purple-500 shadow-lg' 
                : 'border border-gray-200 hover:border-purple-300'
            }`}
            onClick={() => setSelectedPlan('business')}
          >
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-2">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl font-bold">Business Plan</CardTitle>
              <div className="text-3xl font-extrabold text-purple-600">
                $29.99<span className="text-sm font-normal text-gray-500">/month</span>
              </div>
              <Badge className="bg-purple-100 text-purple-700 w-fit mx-auto">
                Best Value
              </Badge>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-2 mb-6">
                {PRICING_PLANS.business.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {selectedPlan === 'business' && (
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                    Ideal for agencies and power users
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Comparison */}
        <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="font-semibold mb-4">What you get with {selectedPlan === 'pro' ? 'Pro' : 'Business'}:</h3>
          
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-green-600 mb-1">
                {selectedPlan === 'pro' ? '500' : 'Unlimited'} conversions/month
              </div>
              <div className="text-gray-600">vs 5/day on Free</div>
            </div>
            
            <div>
              <div className="font-medium text-green-600 mb-1">
                {selectedPlan === 'pro' ? '50MB' : '200MB'} file size
              </div>
              <div className="text-gray-600">vs 10MB on Free</div>
            </div>
            
            <div>
              <div className="font-medium text-green-600 mb-1">
                Creative effects & filters
              </div>
              <div className="text-gray-600">Not available on Free</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-4 mt-8">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Maybe Later
          </Button>
          <Button 
            onClick={handleUpgrade}
            className={`flex-1 ${
              selectedPlan === 'pro' 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            Upgrade to {selectedPlan === 'pro' ? 'Pro' : 'Business'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Guarantee */}
        <div className="text-center mt-4 text-sm text-gray-500">
          <p>✨ 7-day money-back guarantee • Cancel anytime • No hidden fees</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
