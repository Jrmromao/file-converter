"use client"

import { Image } from "lucide-react"
import type { ReactNode } from 'react'

export type FileFormat = {
  value: string
  label: string
  icon: ReactNode
}

export const fileFormats: FileFormat[] = [
  {
    value: 'png',
    label: 'PNG',
    icon: <Image className="w-4 h-4" />
  },
  {
    value: 'jpg',
    label: 'JPG',
    icon: <Image className="w-4 h-4" />
  },
  {
    value: 'webp',
    label: 'WebP',
    icon: <Image className="w-4 h-4" />
  },
  {
    value: 'avif',
    label: 'AVIF',
    icon: <Image className="w-4 h-4" />
  }
] 