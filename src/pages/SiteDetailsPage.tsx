import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  MessageCircle,
  Phone,
  ArrowLeft,
  CheckCircle2,
  Share2,
  ExternalLink,
  ShieldCheck,
  Building,
  Layers,
  Award,
  Check,
  Map,
  Navigation,
  Video,
  Play,
  Crown,
  FileText
} from 'lucide-react';
import { api } from '../services/api.js';
import { Site, PlotSize } from '../types.js';
import { parseVideoUrl } from '../utils/video.js';
import { useSettings } from '../context/SettingsContext.js';
import {
  getWhatsAppUrl,
  getPhoneCallUrl,
  generateSiteWhatsAppMessage,
  generatePlotSizeWhatsAppMessage,
} from '../utils/contact.js';
import { SEO } from '../components/common/SEO.js';

export const SiteDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { settings } = useSettings();
  const [site, setSite] = useState<Site | null>(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadSite() {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const data = await api.getSiteBySlug(slug);
        setSite(data);
        // Find cover image index
        const coverIdx = data.images.findIndex((i) => i.isCover);
        if (coverIdx !== -1) setSelectedImageIdx(coverIdx);
      } catch (err: any) {
        setError(err.message || 'Failed to load project details');
      } finally {
        setLoading(false);
      }
    }
    loadSite();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 animate-pulse">
        <div className="h-6 w-36 bg-slate-200 rounded-md" />
        <div className="h-10 w-96 bg-slate-200 rounded-lg" />
        <div className="aspect-16/9 w-full bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Building className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Project Not Found</h1>
        <p className="text-slate-600">
          The requested M3M project could not be found or has been unpublished.
        </p>
        <Link
          to="/locations"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Available Projects</span>
        </Link>
      </div>
    );
  }

  const locationName = site.location?.name || '';
  const isAvailable = site.status === 'Available';

  // WhatsApp contextual URLs
  const siteWhatsAppMsg = generateSiteWhatsAppMessage(site.name, locationName);
  const siteWhatsAppUrl = getWhatsAppUrl(settings.whatsapp_number, siteWhatsAppMsg);
  const callUrl = getPhoneCallUrl(settings.phone_number);

  const images = site.images && site.images.length > 0
    ? site.images
    : [{ id: 'placeholder', siteId: site.id, imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', isCover: true, displayOrder: 0, createdAt: '' }];

  const currentImage = images[selectedImageIdx] || images[0];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${site.name} - M3M Properties`,
        text: `Explore ${site.name} in ${locationName}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Split features & location advantages
  const featureList = site.features
    ? site.features.split(',').map((f) => f.trim()).filter(Boolean)
    : [];

  const advantageList = site.locationAdvantages
    ? site.locationAdvantages.split(',').map((f) => f.trim()).filter(Boolean)
    : [];

  const realEstateSchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: `${site.name} - M3M Luxury Development`,
    description: site.description || `Iconic real estate development in ${locationName} by M3M.`,
    url: typeof window !== 'undefined' ? window.location.href : '',
    image: currentImage.imageUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address || site.name,
      addressLocality: locationName,
      addressRegion: 'Haryana',
      addressCountry: 'IN',
    },
    geo: site.latitude && site.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: site.latitude,
      longitude: site.longitude,
    } : undefined,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <SEO
        title={`${site.name} – Luxury ${site.siteType || 'Property'} in ${locationName}`}
        description={site.description?.slice(0, 160) || `Discover luxury specifications, floor plans, and pricing for ${site.name}, ${locationName} by M3M Properties.`}
        ogImage={currentImage.imageUrl}
        canonicalPath={`/sites/${site.slug}`}
        schemaData={realEstateSchema}
      />

      {/* Navigation Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-amber-600">Home</Link>
          <span>/</span>
          {site.location ? (
            <Link to={`/locations/${site.location.slug}`} className="hover:text-amber-600">
              {site.location.name}
            </Link>
          ) : (
            <Link to="/locations" className="hover:text-amber-600">Corridors</Link>
          )}
          <span>/</span>
          <span className="font-semibold text-slate-900 truncate max-w-xs">{site.name}</span>
        </div>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? 'Link Copied!' : 'Share Project'}</span>
        </button>
      </div>

      {/* Main Header / Title & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-slate-200">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                isAvailable
                  ? 'bg-emerald-600 text-white'
                  : site.status === 'Sold'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-700 text-white'
              }`}
            >
              {site.status}
            </span>

            <span className="px-3 py-1 rounded-md text-xs font-bold bg-amber-500/15 text-amber-800 border border-amber-500/30">
              M3M {site.siteType || 'Development'}
            </span>

            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              100% RERA Registered
            </span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            {site.name}
          </h1>

          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{site.address}</span>
          </div>
        </div>

        {/* Price & Immediate CTAs */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 p-6 rounded-3xl bg-slate-950 text-white shadow-xl border border-amber-500/30">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Starting Price</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400">
              {site.startingPrice || 'Price on Request'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={siteWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Brochure</span>
            </a>
            <a
              href={callUrl}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>Concierge</span>
            </a>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="space-y-3">
        {/* Main Large Photo */}
        <div className="relative aspect-16/9 sm:aspect-21/9 w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 shadow-xl">
          <img
            src={currentImage.imageUrl}
            alt={`${site.name} architectural photo`}
            className="w-full h-full object-cover object-center"
          />
          {currentImage.isCover && (
            <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-xs text-amber-400 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border border-amber-500/30">
              Featured Gallery
            </div>
          )}
          {parseVideoUrl(site.videoUrl).isValid && (
            <a
              href="#project-video-tour"
              className="absolute bottom-4 right-4 bg-slate-950/90 hover:bg-amber-500 hover:text-slate-950 text-amber-400 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 backdrop-blur-xs transition-all shadow-lg cursor-pointer border border-amber-500/30"
            >
              <Play className="w-3.5 h-3.5 fill-current text-amber-400" />
              <span>Watch Video Tour</span>
            </a>
          )}
        </div>

        {/* Thumbnail Selector */}
        {images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setSelectedImageIdx(idx)}
                className={`relative shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedImageIdx === idx
                    ? 'border-amber-500 scale-105 shadow-sm'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img.imageUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Details, Floor Plans / Configurations, Features & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Description, Configurations, Amenities */}
        <div className="lg:col-span-8 space-y-10">
          {/* 1. Description */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Building className="w-6 h-6 text-amber-600" />
              <span>Architectural Overview & Highlights</span>
            </h2>
            <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {site.description}
            </div>
          </section>

          {/* 2. Available Configurations Table & Cards */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-6 h-6 text-amber-600" />
                  <span>Available Configurations & Pricing</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your desired unit type to receive floor plans and payment milestones.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-1 rounded-full self-start sm:self-auto">
                {site.plotSizes?.length || 0} Layouts Configured
              </span>
            </div>

            {site.plotSizes && site.plotSizes.length > 0 ? (
              <div className="space-y-4">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-4">Configuration / Typology</th>
                        <th className="py-3.5 px-4">Super Area / Dimensions</th>
                        <th className="py-3.5 px-4">Starting Price</th>
                        <th className="py-3.5 px-4">Availability</th>
                        <th className="py-3.5 px-4 text-right">Concierge</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {site.plotSizes.map((plot: PlotSize) => {
                        const plotMsg = generatePlotSizeWhatsAppMessage(
                          plot.plotSize,
                          plot.area,
                          site.name,
                          locationName
                        );
                        const plotWhatsAppUrl = getWhatsAppUrl(settings.whatsapp_number, plotMsg);

                        return (
                          <tr key={plot.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4 px-4 font-bold text-slate-900">
                              {plot.plotSize}
                            </td>
                            <td className="py-4 px-4 text-slate-700 font-medium">
                              {plot.area}
                            </td>
                            <td className="py-4 px-4 font-black text-amber-700">
                              {plot.price}
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                  plot.status === 'Available'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {plot.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              {plot.status === 'Available' ? (
                                <a
                                  href={plotWhatsAppUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                                  <span>Inquire</span>
                                </a>
                              ) : (
                                <span className="text-xs text-slate-400 font-medium">Sold Out</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card List View */}
                <div className="md:hidden space-y-3">
                  {site.plotSizes.map((plot: PlotSize) => {
                    const plotMsg = generatePlotSizeWhatsAppMessage(
                      plot.plotSize,
                      plot.area,
                      site.name,
                      locationName
                    );
                    const plotWhatsAppUrl = getWhatsAppUrl(settings.whatsapp_number, plotMsg);

                    return (
                      <div
                        key={plot.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-900 text-base">
                            {plot.plotSize}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                              plot.status === 'Available'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {plot.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                          <div>
                            <span className="block text-slate-400">Area</span>
                            <span className="font-bold text-slate-800">{plot.area}</span>
                          </div>
                          <div>
                            <span className="block text-slate-400">Price</span>
                            <span className="font-extrabold text-amber-700 text-sm">{plot.price}</span>
                          </div>
                        </div>

                        {plot.status === 'Available' && (
                          <a
                            href={plotWhatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs text-center"
                          >
                            <MessageCircle className="w-4 h-4 fill-current" />
                            <span>Inquire for this Layout</span>
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm italic">
                Unit configurations and floor plan brochures are available upon request through WhatsApp or phone.
              </p>
            )}
          </section>

          {/* 3. Features & Luxury Amenities */}
          {featureList.length > 0 && (
            <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-600" />
                <span>Signature Amenities & Club Facilities</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {featureList.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 4. Location Advantages & Connectivity */}
          {advantageList.length > 0 && (
            <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <Navigation className="w-6 h-6 text-amber-600" />
                <span>Prime Connectivity & Neighborhood Catchment</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {advantageList.map((adv, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{adv}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 5. Project Walkthrough & Video Tour */}
          {(() => {
            const videoInfo = parseVideoUrl(site.videoUrl);
            if (!videoInfo.isValid) return null;

            return (
              <section id="project-video-tour" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-5 scroll-mt-24">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                      <Video className="w-6 h-6 text-amber-600" />
                      <span>Project Walkthrough & Drone Tour</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Watch drone walkthrough footage and elevation highlights of {site.name}.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full self-start sm:self-auto flex items-center gap-1.5">
                    <Play className="w-3 h-3 fill-current text-amber-600" />
                    <span>HD Video</span>
                  </span>
                </div>

                <div className="relative aspect-16/9 bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                  {videoInfo.type === 'youtube' || videoInfo.type === 'vimeo' ? (
                    <iframe
                      src={videoInfo.embedUrl}
                      title={`${site.name} Video Tour`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <video
                      controls
                      controlsList="nodownload"
                      disableRemotePlayback
                      onContextMenu={(e) => e.preventDefault()}
                      playsInline
                      preload="metadata"
                      poster={currentImage.imageUrl}
                      src={videoInfo.sourceUrl}
                      className="w-full h-full object-contain select-none"
                    >
                      Your browser does not support HTML5 video playback.
                    </video>
                  )}
                </div>
              </section>
            );
          })()}
        </div>

        {/* Right Column: Location & Google Maps, Direct Contacts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Contact Box */}
          <div className="bg-slate-950 rounded-3xl border border-amber-500/30 p-6 sm:p-8 text-white shadow-xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>VIP Concierge</span>
              </div>
              <h3 className="font-extrabold text-white text-xl">Direct Developer Inquiries</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Connect directly with our senior relationship manager for confidential floor plan brochures, inventory allotments, and private site visits.
            </p>

            <div className="space-y-3 pt-1">
              <a
                href={siteWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Inquire on WhatsApp</span>
              </a>

              <a
                href={callUrl}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md transition-all active:scale-95"
              >
                <Phone className="w-4 h-4 text-slate-950" />
                <span>Call Concierge</span>
              </a>
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>VIP Site Tour & Experion Center Visit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Detailed Blueprint PDF on WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Bank Loan & Payment Plan Assistance</span>
              </div>
            </div>
          </div>

          {/* Google Maps / Location Info */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Map className="w-5 h-5 text-amber-600" />
              <span>Location & Geo-Coordinates</span>
            </h3>

            <div className="text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-800 leading-relaxed">
                {site.address}
              </p>
              {site.location && (
                <p className="text-slate-500">
                  Corridor: <span className="font-medium text-slate-700">{site.location.name}, {site.location.state}</span>
                </p>
              )}
            </div>

            {/* Map Embed or Direct Google Maps Link */}
            {site.googleMapsUrl ? (
              <div className="space-y-3 pt-2">
                <a
                  href={site.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-amber-50 text-slate-800 hover:text-amber-900 font-bold text-xs border border-slate-200 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open in Google Maps</span>
                </a>

                {/* Map embed iframe */}
                <div className="aspect-16/10 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                  <iframe
                    title="Google Maps Location"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      site.latitude && site.longitude
                        ? `${site.latitude},${site.longitude}`
                        : `${site.name} ${site.address}`
                    )}&hl=en&z=14&output=embed`}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500">
                Detailed location pin and experiential gallery directions are shared upon inquiry.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
