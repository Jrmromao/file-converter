"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// Premium Glass Card Component
export const GlassCard = ({ children, className, ...props }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className={cn(
      "backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-2xl shadow-black/5 dark:shadow-black/20",
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
)

// Premium Gradient Button
export const GradientButton = ({ children, variant = "primary", className, ...props }: any) => {
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 text-gray-900 dark:text-gray-100 shadow-lg",
    success: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25",
    premium: "bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 hover:from-amber-500 hover:via-orange-600 hover:to-pink-600 text-white shadow-lg shadow-orange-500/25"
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// Premium Upload Zone
export const PremiumUploadZone = ({ isDragOver, children, ...props }: any) => (
  <motion.div
    animate={{
      scale: isDragOver ? 1.02 : 1,
      borderColor: isDragOver ? "#3b82f6" : "#e5e7eb"
    }}
    transition={{ duration: 0.2 }}
    className={cn(
      "relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300",
      "bg-gradient-to-br from-gray-50/50 to-blue-50/30 dark:from-gray-900/50 dark:to-blue-900/20",
      "hover:from-blue-50/50 hover:to-indigo-50/40 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/20",
      isDragOver && "border-blue-500 bg-blue-50/70 dark:bg-blue-900/30 shadow-lg shadow-blue-500/20"
    )}
    {...props}
  >
    {/* Animated background pattern */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse" />
    </div>
    {children}
  </motion.div>
)

// Premium Status Badge
export const StatusBadge = ({ status, children, ...props }: any) => {
  const variants = {
    free: "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600",
    pro: "bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600 shadow-lg shadow-blue-500/10",
    business: "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-600 shadow-lg shadow-purple-500/10"
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm",
        variants[status] || variants.free
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Premium Progress Bar
export const PremiumProgress = ({ value, className, ...props }: any) => (
  <div className={cn("w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden", className)} {...props}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full shadow-sm"
    />
  </div>
)

// Premium Feature Card
export const FeatureCard = ({ icon, title, description, isPro = false, onClick, className, ...props }: any) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      "relative p-6 rounded-2xl cursor-pointer transition-all duration-300",
      "bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50",
      "border border-gray-200/50 dark:border-gray-700/50",
      "hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20",
      "hover:border-blue-300 dark:hover:border-blue-600",
      isPro && "ring-2 ring-blue-500/20 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-900/20 dark:to-indigo-900/20",
      className
    )}
    {...props}
  >
    {isPro && (
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold">★</span>
      </div>
    )}
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
  </motion.div>
)

// Premium Modal Overlay
export const PremiumModal = ({ children, isOpen, onClose }: any) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: isOpen ? 1 : 0 }}
    exit={{ opacity: 0 }}
    className={cn(
      "fixed inset-0 z-50 flex items-center justify-center p-4",
      "bg-black/20 backdrop-blur-sm",
      isOpen ? "pointer-events-auto" : "pointer-events-none"
    )}
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ 
        scale: isOpen ? 1 : 0.9, 
        opacity: isOpen ? 1 : 0,
        y: isOpen ? 0 : 20
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={(e) => e.stopPropagation()}
      className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto"
    >
      {children}
    </motion.div>
  </motion.div>
)

// Premium Floating Action Button
export const FloatingButton = ({ children, className, ...props }: any) => (
  <motion.button
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.9 }}
    className={cn(
      "fixed bottom-6 right-6 w-14 h-14 rounded-full",
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white",
      "shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40",
      "backdrop-blur-sm border border-white/20",
      "flex items-center justify-center",
      "transition-all duration-300",
      className
    )}
    {...props}
  >
    {children}
  </motion.button>
)
