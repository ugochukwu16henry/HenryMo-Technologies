// pages/_app.js

import { DefaultSeo } from 'next-seo';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
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
    </>
  );
}
