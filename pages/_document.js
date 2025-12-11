// pages/_document.js

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon_henrymo/favicon.ico" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon_henrymo/favicon-96x96.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon_henrymo/favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon_henrymo/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon_henrymo/site.webmanifest" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

