import React, { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  schemaData?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_TITLE = 'M3M Inventory – Luxury Residential, Retail & Office Spaces in Gurugram';
const DEFAULT_DESCRIPTION = 'Explore iconic luxury residences, high-street retail promenades, Grade-A corporate towers & ultra-luxury serviced suites across Gurugram & NCR by M3M.';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';
const DEFAULT_KEYWORDS = 'M3M Inventory, m3m india, m3m gurugram, m3m altitude, m3m golf hills, m3m jewel, m3m urbana, m3m ifc, luxury apartments gurugram, golf course extension road, retail shops gurugram';

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalPath,
  ogType = 'website',
  ogImage,
  schemaData,
}) => {
  useEffect(() => {
    // 1. Page Title
    const fullTitle = title 
      ? (title.includes('M3M') ? title : `${title} | M3M Inventory`)
      : DEFAULT_TITLE;
    document.title = fullTitle;

    // Helper to set or create meta tag
    const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to set or create link tag
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    const finalDescription = description || DEFAULT_DESCRIPTION;
    const finalImage = ogImage || DEFAULT_IMAGE;
    const finalKeywords = keywords || DEFAULT_KEYWORDS;
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    const currentUrl = typeof window !== 'undefined' 
      ? (canonicalPath ? `${currentOrigin}${canonicalPath}` : window.location.href)
      : '';

    // Standard Meta
    setMetaTag('name', 'description', finalDescription);
    setMetaTag('name', 'keywords', finalKeywords);

    // OpenGraph
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', finalDescription);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', finalImage);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:site_name', 'M3M Inventory');

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', finalDescription);
    setMetaTag('name', 'twitter:image', finalImage);

    // Canonical & Developer Links
    if (currentUrl) {
      setLinkTag('canonical', currentUrl);
    }
    setLinkTag('author', 'https://www.aerologictechnologies.com');
    setLinkTag('creator', 'https://www.aerologictechnologies.com');
    setMetaTag('name', 'developer', 'Aero Logic Technologies (https://www.aerologictechnologies.com)');

    // Schema.org Structured Data (JSON-LD)
    const scriptId = 'seo-structured-data-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (schemaData) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(schemaData);
    } else if (scriptTag) {
      // Default Base Organization Schema
      const defaultSchema = {
        '@context': 'https://schema.org',
        '@type': 'RealEstateAgent',
        name: 'M3M Inventory Concierge & Sales Desk',
        url: currentOrigin,
        logo: finalImage,
        description: finalDescription,
        areaServed: {
          '@type': 'AdministrativeArea',
          name: 'Gurugram & NCR, India',
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Golf Course Extension Road, Sector 65',
          addressLocality: 'Gurugram',
          addressRegion: 'Haryana',
          postalCode: '122018',
          addressCountry: 'IN',
        },
        creator: {
          '@type': 'Organization',
          name: 'Aero Logic Technologies',
          url: 'https://www.aerologictechnologies.com',
          sameAs: ['https://www.aerologictechnologies.com'],
        },
        provider: {
          '@type': 'Organization',
          name: 'Aero Logic Technologies',
          url: 'https://www.aerologictechnologies.com',
        },
      };
      scriptTag.text = JSON.stringify(defaultSchema);
    }
  }, [title, description, keywords, canonicalPath, ogType, ogImage, schemaData]);

  return null;
};
