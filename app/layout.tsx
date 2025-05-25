import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Image, FileImage, Palette, Film } from "lucide-react"
import type { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PNG Convert',
  description: 'Convert and optimize your images with advanced features',
  generator: 'PNG Convert',
}

export type FileFormat = {
  value: string
  label: string
  icon: ReactNode
}

export const fileFormats: FileFormat[] = [
  {
    value: 'png',
    label: 'PNG',
    icon: <Image className="w-5 h-5 text-blue-500" />
  },
  {
    value: 'jpg',
    label: 'JPG',
    icon: <FileImage className="w-5 h-5 text-yellow-500" />
  },
  {
    value: 'webp',
    label: 'WebP',
    icon: <Palette className="w-5 h-5 text-green-500" />
  },
  {
    value: 'avif',
    label: 'AVIF',
    icon: <Film className="w-5 h-5 text-purple-500" />
  }
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <GoogleAnalytics gaId="G-313BF1QH73" />
        <Toaster />
      </body>
    </html>
  )
}
