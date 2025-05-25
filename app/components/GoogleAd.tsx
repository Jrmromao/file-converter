// app/components/GoogleAd.tsx
"use client"

import React, { useEffect } from 'react'
import Script from 'next/script'

interface GoogleAdProps {
  adSlot: string
  adClient: string
  style?: React.CSSProperties
  className?: string
  format?: string
  responsive?: boolean
}

export const GoogleAd: React.FC<GoogleAdProps> = ({
  adSlot,
  adClient,
  style = { display: "block" },
  className = "",
  format = "auto",
  responsive = true,
}) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <ins
        className={`adsbygoogle ${className}`}
        style={style}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </>
  )
}