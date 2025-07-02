import { Button } from "@/components/ui/button"
import { Crown } from "lucide-react"

interface ProFeatureProps {
  children: React.ReactNode
  isPro: boolean
  onUpgrade: () => void
}

export function ProFeature({ children, isPro, onUpgrade }: ProFeatureProps) {
  if (isPro) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
        <Button onClick={onUpgrade} size="sm" className="bg-purple-600 hover:bg-purple-700">
          <Crown className="w-4 h-4 mr-2" />
          Upgrade to Pro
        </Button>
      </div>
    </div>
  )
} 