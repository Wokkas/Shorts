import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoHeadProps {
  title?: string;
  description?: string;
  url?: string;
}

const SeoHead: React.FC<SeoHeadProps> = ({ 
  title = "ShortsGenius - Free YouTube Shorts Downloader (HD)", 
  description = "Download YouTube Shorts videos in HD quality for free. Fast, no watermark, and unlimited downloads. The best online tool to save Shorts to your device.",
  // Ensure the default URL is strictly the non-www version as configured in DNS
  url = "https://shortsdownload.de5.net" 
}) => {
  
  // JSON-LD Structured Data for "SoftwareApplication"
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ShortsGenius",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": description,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    }
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content="youtube shorts downloader, download youtube shorts, save shorts video, youtube shorts to mp4, free video downloader, no watermark" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* Add an og:image here when you have a screenshot of your app */}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />

      {/* Canonical - Crucial for SEO to merge www and non-www */}
      <link rel="canonical" href={url} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SeoHead;