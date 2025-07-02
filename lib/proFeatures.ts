export const PRO_FEATURES = {
  FREE: {
    dailyConversions: 10,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    formats: ['png', 'jpg', 'webp'],
    aiFeatures: false,
    batchProcessing: false,
    priorityProcessing: false,
    watermarkRemoval: false,
    advancedFilters: false
  },
  PRO: {
    dailyConversions: 100,
    maxFileSize: 25 * 1024 * 1024, // 25MB
    formats: ['png', 'jpg', 'webp', 'avif', 'svg'],
    aiFeatures: true,
    batchProcessing: true,
    priorityProcessing: true,
    watermarkRemoval: true,
    advancedFilters: true
  }
}

export const PRO_PRICE = 9.99 // $9.99/month

// Placeholder for user check
export async function checkUserLimits(userId: string | null) {
  if (!userId) {
    // Anonymous user - free tier limits
    return PRO_FEATURES.FREE
  }

  // TODO: Implement actual user check when auth is added
  // For now, return free tier
  return PRO_FEATURES.FREE
} 