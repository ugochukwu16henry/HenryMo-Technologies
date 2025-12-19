// hooks/usePageTracking.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function usePageTracking() {
  const router = useRouter();

  useEffect(() => {
    // Check if user accepted cookies
    const consent = localStorage.getItem('cookieConsent');
    if (consent !== 'accepted') return;

    // Track initial page view
    trackPageView(router.asPath);

    // Track page changes
    const handleRouteChange = (url) => {
      trackPageView(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);
}

async function trackPageView(page) {
  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page,
        referrer: document.referrer || null,
        userAgent: navigator.userAgent,
      }),
    });
  } catch (error) {
    // Silently fail - don't interrupt user experience
    console.log('Tracking failed:', error);
  }
}


