import React, { useEffect } from 'react';

interface GoogleAdProps {
  adSlot: string
  adClient: string
  style?: React.CSSProperties
  className?: string
  format?: string
  responsive?: boolean
  layout?: string
}

export const GoogleAd: React.FC<GoogleAdProps> = ({ 
    adSlot,
    adClient,
    style = { display: "block" },
    className = "",
    format = "auto",
    responsive = true,
    layout = "",

}) => {
  useEffect(() => {
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch (e) {
      console.error('Error loading ads:', e);
    }
  }, []);

  return (
    <ins className={`adsbygoogle ${className}`}
         style={style}
         data-full-width-responsive={responsive ? "true" : "false"}
         data-ad-client={adClient}
         data-ad-slot={adSlot}
         data-ad-format={format}
         data-ad-layout={layout}></ins>
  );
};

 