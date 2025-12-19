// components/GoogleAnalytics.js

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Replace with your Google Analytics Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

// Track page views
export const pageview = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track events
export const event = ({ action, category, label, value }) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export default function GoogleAnalytics() {
  const router = useRouter();
  const [consent, setConsent] = useState(null);

  useEffect(() => {
    // Check cookie consent on mount and when it changes
    const checkConsent = () => {
      const cookieConsent = localStorage.getItem('cookieConsent');
      setConsent(cookieConsent);
    };
    
    checkConsent();
    // Check periodically in case user changes consent
    const interval = setInterval(checkConsent, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Only track if consent is accepted
    if (consent !== 'accepted') return;

    const handleRouteChange = (url) => {
      pageview(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, consent]);

  // Don't load if no GA ID or cookies not accepted
  if (!GA_MEASUREMENT_ID || consent !== 'accepted') return null;

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Check cookie consent before tracking
            const consent = localStorage.getItem('cookieConsent');
            if (consent === 'accepted') {
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            }
          `,
        }}
      />
    </>
  );
}


