import React, { useEffect, useRef } from 'react';

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
  const adRef = useRef<any>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current && window.adsbygoogle && adRef.current) {
      try {
        window.adsbygoogle.push({});
        initializedRef.current = true;
      } catch (e) {
        // Ignore duplicate ad error
      }
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={style}
      data-full-width-responsive={responsive ? "true" : "false"}
      data-ad-client={adClient}
      data-ad-slot={adSlot}
      data-ad-format={format}
      data-ad-layout={layout}
    ></ins>
  );
};

 