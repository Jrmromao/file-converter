export interface SocialMediaPreset {
  width: number
  height: number
  label: string
  quality: number
  description: string
}

export interface PlatformPresets {
  [key: string]: SocialMediaPreset
}

export const SOCIAL_MEDIA_PRESETS: Record<string, PlatformPresets> = {
  instagram: {
    square: { 
      width: 1080, 
      height: 1080, 
      label: 'Square Post (1:1)', 
      quality: 90,
      description: 'Perfect for Instagram feed posts'
    },
    portrait: { 
      width: 1080, 
      height: 1350, 
      label: 'Portrait Post (4:5)', 
      quality: 90,
      description: 'Vertical posts for better engagement'
    },
    landscape: { 
      width: 1080, 
      height: 566, 
      label: 'Landscape Post (1.91:1)', 
      quality: 90,
      description: 'Horizontal posts and carousels'
    },
    story: { 
      width: 1080, 
      height: 1920, 
      label: 'Story (9:16)', 
      quality: 85,
      description: 'Instagram Stories and Reels'
    },
    reel: { 
      width: 1080, 
      height: 1920, 
      label: 'Reel (9:16)', 
      quality: 90,
      description: 'Instagram Reels vertical video'
    }
  },
  facebook: {
    profile: { 
      width: 170, 
      height: 170, 
      label: 'Profile Picture', 
      quality: 90,
      description: 'Facebook profile photo'
    },
    cover: { 
      width: 820, 
      height: 312, 
      label: 'Cover Photo', 
      quality: 85,
      description: 'Facebook cover image'
    },
    post: { 
      width: 1200, 
      height: 630, 
      label: 'Shared Post', 
      quality: 85,
      description: 'Facebook feed posts'
    },
    story: { 
      width: 1080, 
      height: 1920, 
      label: 'Story', 
      quality: 85,
      description: 'Facebook Stories'
    },
    event: { 
      width: 1920, 
      height: 1080, 
      label: 'Event Cover', 
      quality: 85,
      description: 'Facebook event banner'
    }
  },
  twitter: {
    profile: { 
      width: 400, 
      height: 400, 
      label: 'Profile Picture', 
      quality: 90,
      description: 'Twitter profile photo'
    },
    header: { 
      width: 1500, 
      height: 500, 
      label: 'Header Photo', 
      quality: 90,
      description: 'Twitter banner image'
    },
    post: { 
      width: 1200, 
      height: 675, 
      label: 'Post Image', 
      quality: 85,
      description: 'Twitter post attachments'
    },
    card: { 
      width: 800, 
      height: 418, 
      label: 'Twitter Card', 
      quality: 85,
      description: 'Link preview images'
    }
  },
  linkedin: {
    profile: { 
      width: 400, 
      height: 400, 
      label: 'Profile Picture', 
      quality: 90,
      description: 'LinkedIn profile photo'
    },
    banner: { 
      width: 1584, 
      height: 396, 
      label: 'Banner Image', 
      quality: 90,
      description: 'LinkedIn profile banner'
    },
    post: { 
      width: 1200, 
      height: 627, 
      label: 'Post Image', 
      quality: 85,
      description: 'LinkedIn feed posts'
    },
    company: { 
      width: 300, 
      height: 300, 
      label: 'Company Logo', 
      quality: 90,
      description: 'LinkedIn company page logo'
    }
  },
  pinterest: {
    pin: { 
      width: 1000, 
      height: 1500, 
      label: 'Pin (2:3)', 
      quality: 85,
      description: 'Standard Pinterest pin'
    },
    square: { 
      width: 1000, 
      height: 1000, 
      label: 'Square Pin (1:1)', 
      quality: 85,
      description: 'Square Pinterest pin'
    },
    story: { 
      width: 1080, 
      height: 1920, 
      label: 'Story Pin (9:16)', 
      quality: 85,
      description: 'Pinterest Story pins'
    }
  },
  youtube: {
    thumbnail: { 
      width: 1280, 
      height: 720, 
      label: 'Thumbnail (16:9)', 
      quality: 90,
      description: 'YouTube video thumbnail'
    },
    banner: { 
      width: 2560, 
      height: 1440, 
      label: 'Channel Banner', 
      quality: 85,
      description: 'YouTube channel art'
    },
    profile: { 
      width: 800, 
      height: 800, 
      label: 'Profile Picture', 
      quality: 90,
      description: 'YouTube channel icon'
    }
  }
}

export function getAllPresets(): Array<{ platform: string; preset: string; config: SocialMediaPreset }> {
  const allPresets: Array<{ platform: string; preset: string; config: SocialMediaPreset }> = []
  
  Object.entries(SOCIAL_MEDIA_PRESETS).forEach(([platform, presets]) => {
    Object.entries(presets).forEach(([preset, config]) => {
      allPresets.push({ platform, preset, config })
    })
  })
  
  return allPresets
}
