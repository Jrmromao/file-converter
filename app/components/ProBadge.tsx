import { Badge } from "@/components/ui/badge"
import { Crown } from "lucide-react"

export function ProBadge() {
  return (
    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
      <Crown className="w-3 h-3 mr-1" />
      PRO
    </Badge>
  )
} 