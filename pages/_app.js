// pages/_app.js

import { DefaultSeo } from 'next-seo';
import { Toaster } from 'react-hot-toast';
import CookieConsent from '../components/CookieConsent';
import GoogleAnalytics from '../components/GoogleAnalytics';
import usePageTracking from '../hooks/usePageTracking';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  // Track page views (respects cookie consent)
  usePageTracking();
  
  return (
    <>
      {/* Global SEO defaults */}
      <DefaultSeo
        titleTemplate="%s — HenryMo Technologies"
        defaultTitle="HenryMo Technologies — Where Ideas Become Powerful Digital Solutions"
        description="We build powerful digital experiences for the modern world: websites, mobile apps, custom software, and automation tools."
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://henrymo.tech',
          siteName: 'HenryMo Technologies',
          images: [
            {
              url: 'https://henrymo.tech/images/og.jpg',
              width: 1200,
              height: 630,
              alt: 'HenryMo Technologies',
            },
          ],
        }}
        twitter={{
          handle: '@henrymotech',
          site: '@henrymotech',
          cardType: 'summary_large_image',
        }}
      />
      <Component {...pageProps} />
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      {/* Cookie Consent Banner */}
      <CookieConsent />
      {/* Google Analytics */}
      <GoogleAnalytics />
    </>
  );
}
