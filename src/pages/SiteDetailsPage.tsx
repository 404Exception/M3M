import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  MessageCircle,
  Phone,
  ArrowLeft,
  ArrowRight,
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
  Gem,
  FileText,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Calendar,
  Clock,
  Car,
  Compass,
  Eye,
  Sliders,
  CheckCircle,
  HelpCircle,
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
import { QuickEnquiryModal } from '../components/QuickEnquiryModal.js';
import { SiteCard } from '../components/SiteCard.js';

export const SiteDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { settings } = useSettings();
  const [site, setSite] = useState<Site | null>(null);
  const [allSites, setAllSites] = useState<Site[]>([]);
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const [activeMediaTab, setActiveMediaTab] = useState<'gallery' | 'video' | 'masterplan' | 'floorplans' | 'virtual'>('gallery');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedPlanIdx, setSelectedPlanIdx] = useState<number>(0);
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('11:00 AM');
  const [visitBooked, setVisitBooked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadSite() {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const [data, sitesList] = await Promise.all([
          api.getSiteBySlug(slug),
          api.getSites().catch(() => []),
        ]);
        setSite(data);
        setAllSites(sitesList);

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
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto" />
          <p className="text-sm font-serif-luxury uppercase tracking-widest text-amber-400">
            Curating Architectural Dossier...
          </p>
        </div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Building className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-serif-luxury">Project Not Found</h1>
        <p className="text-slate-600">
          The requested M3M landmark could not be found or has been moved.
        </p>
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore All 60+ Developments</span>
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

  // Curated fallback gallery
  const defaultImages = [
    { id: 'img-1', siteId: site.id, imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80', isCover: true, displayOrder: 0, createdAt: '' },
    { id: 'img-2', siteId: site.id, imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80', isCover: false, displayOrder: 1, createdAt: '' },
    { id: 'img-3', siteId: site.id, imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80', isCover: false, displayOrder: 2, createdAt: '' },
    { id: 'img-4', siteId: site.id, imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80', isCover: false, displayOrder: 3, createdAt: '' },
  ];

  const images = site.images && site.images.length > 0 ? site.images : defaultImages;
  const currentImage = images[selectedImageIdx] || images[0];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${site.name} - M3M Luxury Development`,
        text: `Explore ${site.name} in ${locationName}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVisitBooked(true);
    const visitMsg = `Hello, I would like to schedule a private VIP Site Visit for ${site.name} (${locationName}) on ${visitDate || 'upcoming weekend'} at ${visitTime}. Please confirm my appointment with the relationship manager.`;
    window.open(getWhatsAppUrl(settings.whatsapp_number, visitMsg), '_blank');
  };

  // Split features & location advantages dynamically from backend
  const featureList = site.features && site.features.trim().length > 0
    ? site.features
        .split(/[\n,;]+/)
        .map((f) => f.trim())
        .filter(Boolean)
    : [
        'Private Elevators & Double-Height Lobby',
        'Olympic-sized Swimming Pool & Sky Deck',
        'State-of-the-art Fitness & Spa Sanctuary',
        'Smart VRV Multi-zone Climate Automation',
        '100% Power Backup & 5-Tier Biometric Security',
        'Curated Alfresco Dining & Landscaped Greens',
      ];

  const advantageList = site.locationAdvantages && site.locationAdvantages.trim().length > 0
    ? site.locationAdvantages
        .split(/[\n,;]+/)
        .map((f) => f.trim())
        .filter(Boolean)
    : [
        'Direct Arterial Expressway Access',
        '15 Mins to IGI Airport Terminal 3',
        '10 Mins to Cyber City & CBD Hubs',
        '5 Mins to Rapid Metro & Diplomatic Enclaves',
      ];

  const getAmenityIcon = (name: string, index: number) => {
    const lower = name.toLowerCase();
    if (lower.includes('sky') || lower.includes('club') || lower.includes('penthouse') || lower.includes('palace') || lower.includes('lounge')) return Crown;
    if (lower.includes('pool') || lower.includes('water') || lower.includes('aqua') || lower.includes('spa') || lower.includes('hammam') || lower.includes('bath') || lower.includes('jacuzzi')) return Award;
    if (lower.includes('gym') || lower.includes('sport') || lower.includes('court') || lower.includes('tennis') || lower.includes('squash') || lower.includes('golf') || lower.includes('track') || lower.includes('fitness')) return Award;
    if (lower.includes('security') || lower.includes('biometric') || lower.includes('rera') || lower.includes('fire') || lower.includes('backup') || lower.includes('safe') || lower.includes('gated')) return ShieldCheck;
    if (lower.includes('smart') || lower.includes('automation') || lower.includes('climate') || lower.includes('vrv') || lower.includes('ev') || lower.includes('charge') || lower.includes('power')) return Crown;
    if (lower.includes('elevator') || lower.includes('lift') || lower.includes('lobby') || lower.includes('terrace') || lower.includes('balcony') || lower.includes('tower') || lower.includes('facade')) return Building;
    if (lower.includes('green') || lower.includes('park') || lower.includes('garden') || lower.includes('landscape') || lower.includes('plaza') || lower.includes('boulevard')) return Compass;

    const cycle = [Crown, Award, ShieldCheck, Building, Layers];
    return cycle[index % cycle.length];
  };

  // Related sites from same location or type
  const relatedSites = allSites
    .filter((s) => s.id !== site.id && (s.locationId === site.locationId || s.siteType === site.siteType))
    .slice(0, 3);

  const videoInfo = parseVideoUrl(site.videoUrl || 'https://www.youtube.com/watch?v=w7wK7QhJ7a4');

  // Architectural Specifications & Standards
  const specifications = [
    { title: 'Structural Engineering', desc: 'Earthquake Resistant RCC Frame Structure (Zone IV Compliant) engineered with ultra-high-performance M60 concrete.' },
    { title: 'Living & Dining Finishes', desc: 'Imported Italian Botticino/Dyna Marble flooring, acoustic double-glazed Low-E French glass facade.' },
    { title: 'HVAC & Climate Control', desc: 'Centralized VRV/VRF multi-zone air conditioning with treated fresh air (TFA) filtration units.' },
    { title: 'Elevators & Mobility', desc: 'Ultra-high-speed 3.5 m/s Mitsubishi/Otis passenger elevators with biometric destination dispatch.' },
    { title: 'Smart Home Automation', desc: 'Integrated iPad/mobile smart lighting, automated curtain controls, digital locksets, and video door phones.' },
    { title: 'Eco-Sustainability', desc: 'IGBC/LEED Gold compliant, rainwater harvesting, solar street illumination, and decentralized STP water reuse.' },
  ];

  return (
    <div className="bg-[#080c14] text-slate-100 min-h-screen">
      <SEO
        title={`${site.name} – Luxury ${site.siteType || 'Masterpiece'} in ${locationName}`}
        description={site.description?.slice(0, 160) || `Explore architectural blueprints, floor plans, and VIP tour for ${site.name}, ${locationName} by M3M.`}
        ogImage={currentImage.imageUrl}
        canonicalPath={`/sites/${site.slug}`}
      />

      {/* 1. CINEMATIC HERO SECTION WITH FLOATING STATS */}
      <section className="relative overflow-hidden bg-slate-950 border-b border-amber-500/20 pt-6 pb-12 sm:pb-16">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Top Breadcrumb & Share Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
              <span>/</span>
              <Link to="/portfolio" className="hover:text-amber-400 transition-colors">Portfolio</Link>
              <span>/</span>
              {site.location ? (
                <Link to={`/locations/${site.location.slug}`} className="hover:text-amber-400 transition-colors">
                  {site.location.name}
                </Link>
              ) : (
                <Link to="/corridors" className="hover:text-amber-400 transition-colors">Corridors</Link>
              )}
              <span>/</span>
              <span className="font-semibold text-amber-400 truncate max-w-xs">{site.name}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-amber-400 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Dossier Link Copied!' : 'Share Landmark'}</span>
              </button>
            </div>
          </div>

          {/* Main Title & Action Strip */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md">
                  M3M {site.siteType || 'Landmark'}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    isAvailable
                      ? 'bg-emerald-600/90 text-white border border-emerald-500/40'
                      : site.status === 'Sold'
                      ? 'bg-red-700/90 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {site.status}
                </span>

                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  100% RERA Registered
                </span>
              </div>

              <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                {site.name}
              </h1>

              <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{site.address}</span>
              </div>
            </div>

            {/* Quick Action CTA Group */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setEnquiryModalOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download E-Brochure</span>
              </button>

              <a
                href={siteWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all active:scale-95 flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp RM</span>
              </a>

              <a
                href={callUrl}
                className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-400 font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Concierge</span>
              </a>
            </div>
          </div>

          {/* Architectural Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-4">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Asset Class</span>
              <span className="text-sm font-bold text-white mt-0.5 block truncate">{site.siteType || 'Residential'}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Corridor</span>
              <span className="text-sm font-bold text-amber-400 mt-0.5 block truncate">{locationName || 'Gurugram'}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Typologies</span>
              <span className="text-sm font-bold text-white mt-0.5 block truncate">{site.plotSizes?.length || 'Bespoke'} Layouts</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Architects</span>
              <span className="text-sm font-bold text-white mt-0.5 block truncate">Chapman Taylor / RSP</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Investment</span>
              <span className="text-sm font-bold text-emerald-400 mt-0.5 block truncate">Price on Request</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">RERA Status</span>
              <span className="text-sm font-bold text-amber-400 mt-0.5 block truncate">Registered</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE LIVE MEDIA DECK (GALLERY, 4K VIDEO, MASTER PLAN, FLOOR PLANS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
        {/* Media Deck Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 overflow-x-auto scrollbar-thin gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveMediaTab('gallery')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                activeMediaTab === 'gallery'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Visual Gallery ({images.length})</span>
            </button>

            <button
              onClick={() => setActiveMediaTab('video')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                activeMediaTab === 'video'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>4K Drone & Walkthrough Tour</span>
            </button>

            {/* <button
              onClick={() => setActiveMediaTab('floorplans')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                activeMediaTab === 'floorplans'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Floor Plans & Typologies</span>
            </button> */}

            <button
              onClick={() => setActiveMediaTab('masterplan')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                activeMediaTab === 'masterplan'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Architectural Master Plan</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-400 text-xs font-semibold cursor-pointer shrink-0"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Full-Screen Lightbox</span>
          </button>
        </div>

        {/* Tab 1: Visual Photo Gallery */}
        {activeMediaTab === 'gallery' && (
          <div className="space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-16/9 sm:aspect-21/9 w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group">
              <img
                src={currentImage.imageUrl}
                alt={`${site.name} architectural perspective`}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
              />

              {/* Ambient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30 pointer-events-none" />

              {/* Caption & Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3">
                <div className="bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-xl border border-amber-500/30 text-xs text-slate-200 font-medium">
                  <span className="text-amber-400 font-bold mr-2">Perspective {selectedImageIdx + 1} of {images.length}:</span>
                  <span>{currentImage.isCover ? 'Elevation & Skyline Presence' : `Architectural Facet ${selectedImageIdx + 1}`}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedImageIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-amber-500 hover:text-slate-950 text-white backdrop-blur-md border border-slate-700 transition-all cursor-pointer"
                    aria-label="Previous Image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedImageIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-amber-500 hover:text-slate-950 text-white backdrop-blur-md border border-slate-700 transition-all cursor-pointer"
                    aria-label="Next Image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 text-xs px-3.5"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Zoom</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnail Navigation Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`relative shrink-0 w-28 sm:w-36 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImageIdx === idx
                        ? 'border-amber-500 ring-2 ring-amber-500/30 scale-105 shadow-lg'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.imageUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/20" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: 4K Drone & Walkthrough Video Player */}
        {activeMediaTab === 'video' && (
          <div className="space-y-4">
            <div className="relative aspect-16/9 w-full bg-slate-950 rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl">
              {videoInfo.type === 'youtube' || videoInfo.type === 'vimeo' ? (
                <iframe
                  src={`${videoInfo.embedUrl}?autoplay=1&rel=0&modestbranding=1`}
                  title={`${site.name} Cinematic Video Tour`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <video
                  controls
                  autoPlay
                  controlsList="nodownload"
                  playsInline
                  poster={currentImage.imageUrl}
                  src={videoInfo.sourceUrl}
                  className="w-full h-full object-contain"
                >
                  Your browser does not support HTML5 video playback.
                </video>
              )}
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-2">
                <Play className="w-4 h-4 text-amber-400 fill-current" />
                <span>Official M3M Architectural Walkthrough & Cinematic Elevation Film</span>
              </span>
              <button
                onClick={() => setEnquiryModalOpen(true)}
                className="text-amber-400 hover:underline font-bold"
              >
                Request 4K Video File on WhatsApp →
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Floor Plans & Typologies Studio */}
        {activeMediaTab === 'floorplans' && (
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white font-serif-luxury flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  <span>Interactive Floor Plan Typologies</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Select a layout below to inspect architectural dimensions and request official CAD/PDF blueprints.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEnquiryModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download All Layouts PDF</span>
              </button>
            </div>

            {/* Typology Selectors */}
            {site.plotSizes && site.plotSizes.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                  {site.plotSizes.map((plot, idx) => (
                    <button
                      key={plot.id}
                      onClick={() => setSelectedPlanIdx(idx)}
                      className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                        selectedPlanIdx === idx
                          ? 'bg-amber-500 text-slate-950 shadow-md scale-102'
                          : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      <span className="block">{plot.plotSize}</span>
                      <span className="block text-[10px] font-normal opacity-80">{plot.area}</span>
                    </button>
                  ))}
                </div>

                {/* Selected Plan Details View */}
                {site.plotSizes[selectedPlanIdx] && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 rounded-2xl bg-slate-950 border border-amber-500/20">
                    <div className="lg:col-span-7 relative aspect-16/10 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center p-4">
                      {/* Architectural Blueprint Graphic */}
                      <div className="text-center space-y-3">
                        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                          <Layers className="w-8 h-8" />
                        </div>
                        <h4 className="text-lg font-bold text-white font-serif-luxury">
                          {site.plotSizes[selectedPlanIdx].plotSize}
                        </h4>
                        <p className="text-xs text-slate-400 max-w-sm">
                          Super Area: {site.plotSizes[selectedPlanIdx].area} • High-ceiling living lounge, master en-suite, wrap-around viewing balconies.
                        </p>
                        <button
                          type="button"
                          onClick={() => setEnquiryModalOpen(true)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-400 text-xs font-bold transition-all cursor-pointer"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Request High-Res Blueprint CAD</span>
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-5 space-y-4">
                      <div className="space-y-1">
                        <span className="text-xs font-bold uppercase text-amber-400 tracking-wider">Typology Specification</span>
                        <h4 className="text-2xl font-bold text-white font-serif-luxury">
                          {site.plotSizes[selectedPlanIdx].plotSize}
                        </h4>
                      </div>

                      <div className="space-y-2.5 text-xs text-slate-300">
                        <div className="flex justify-between py-2 border-b border-slate-800">
                          <span className="text-slate-400">Super Built-up Area</span>
                          <span className="font-bold text-white">{site.plotSizes[selectedPlanIdx].area}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-800">
                          <span className="text-slate-400">Balcony / Deck</span>
                          <span className="font-bold text-white">Continuous Glass Railing Deck</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-800">
                          <span className="text-slate-400">Floor Heights</span>
                          <span className="font-bold text-white">11.5 Ft (3.5 Meters)</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-800">
                          <span className="text-slate-400">Investment Status</span>
                          <span className="font-bold text-amber-400">Price on Request</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <a
                          href={getWhatsAppUrl(
                            settings.whatsapp_number,
                            generatePlotSizeWhatsAppMessage(
                              site.plotSizes[selectedPlanIdx].plotSize,
                              site.plotSizes[selectedPlanIdx].area,
                              site.name,
                              locationName
                            )
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                        >
                          <MessageCircle className="w-4 h-4 fill-current" />
                          <span>Request Pricing & Payment Plan for this Layout</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">
                Bespoke floor plans and structural layouts are available through confidential concierge inquiry.
              </p>
            )}
          </div>
        )}

        {/* Tab 4: Architectural Master Plan */}
        {activeMediaTab === 'masterplan' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white font-serif-luxury flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-400" />
                  <span>Comprehensive Site Master Layout</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Master-planned by international urban architects featuring vehicular drop-offs, central thematic gardens, and clubhouse zoning.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEnquiryModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                <span>Download Master Plan PDF</span>
              </button>
            </div>

            <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-6">
              <img
                src={images[1]?.imageUrl || currentImage.imageUrl}
                alt={`${site.name} Master Plan Blueprint`}
                className="w-full h-full object-cover filter contrast-125"
              />
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-2xs flex items-center justify-center p-6">
                <div className="max-w-md text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
                    <Compass className="w-7 h-7 animate-pulse" />
                  </div>
                  <h4 className="text-xl font-bold text-white font-serif-luxury">
                    Architectural Master Layout & Zoning
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Featuring vehicular drop-offs, 75%+ green open landscapes, central sports pavilions, and private residential towers.
                  </p>
                  <button
                    type="button"
                    onClick={() => setEnquiryModalOpen(true)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-lg cursor-pointer"
                  >
                    Receive Complete Master Plan Blueprint PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. MAIN CONTENT: ARCHITECTURAL OVERVIEW, AMENITIES, CONNECTIVITY & CONCIERGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Narrative, Amenities, Specifications */}
          <div className="lg:col-span-8 space-y-10">
            {/* 3.1 Narrative Overview */}
            <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>The Architectural Vision</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-luxury">
                Where Grandeur Meets Architectural Precision
              </h2>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4 font-normal">
                {site.description}
              </div>
            </div>

            {/* 3.2 Dynamic Luxury Features & Amenities from Backend */}
            <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-8 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">7-Star Lifestyle</span>
                  <h3 className="text-2xl font-bold text-white font-serif-luxury mt-1">
                    Signature Club & Resort Amenities
                  </h3>
                </div>
                <span className="text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full self-start sm:self-auto flex items-center gap-1.5">
                  <Gem className="w-3.5 h-3.5 text-amber-400" />
                  <span>{featureList.length} Curated Luxuries</span>
                </span>
              </div>

              {/* Dynamic Feature Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {featureList.map((feat, idx) => {
                  const Icon = getAmenityIcon(feat, idx);
                  return (
                    <div
                      key={idx}
                      className="group p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800/90 hover:border-amber-500/50 transition-all duration-300 flex items-start gap-3.5"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                            {feat}
                          </h4>
                        </div>
                        {/* <p className="text-[11px] text-slate-400 leading-relaxed">
                          Included in standard developer allotment & master club privilege.
                        </p> */}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3.3 Strategic Transit & Connectivity */}
            <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Arterial Position</span>
                <h3 className="text-2xl font-bold text-white font-serif-luxury mt-1">
                  Strategic Corridor Connectivity
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {advantageList.map((adv, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  >
                    <Navigation className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="font-semibold leading-relaxed">{adv}</span>
                  </div>
                ))}
              </div>

              {/* Transit Distance Badges */}
              {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <span className="text-amber-400 font-black text-lg block">15 Mins</span>
                  <span className="text-[11px] text-slate-400 block font-medium">IGI Airport T3</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <span className="text-amber-400 font-black text-lg block">10 Mins</span>
                  <span className="text-[11px] text-slate-400 block font-medium">Cyber Hub</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <span className="text-amber-400 font-black text-lg block">05 Mins</span>
                  <span className="text-[11px] text-slate-400 block font-medium">Rapid Metro</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <span className="text-amber-400 font-black text-lg block">00 Mins</span>
                  <span className="text-[11px] text-slate-400 block font-medium">Expressway</span>
                </div>
              </div> */}
            </div>

            {/* 3.4 Technical Specifications & Construction Engineering */}
            <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Global Quality Standards</span>
                <h3 className="text-2xl font-bold text-white font-serif-luxury mt-1">
                  Structural Engineering & Material Finishes
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {specifications.map((spec, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>{spec.title}</span>
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {spec.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: VIP Concierge Desk, Schedule Site Visit, Google Map */}
          <div className="lg:col-span-4 space-y-6">
            {/* VIP Developer Concierge Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-amber-500/40 text-white shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>Official Developer Concierge</span>
                </div>
                <h3 className="font-serif-luxury font-bold text-2xl text-white">
                  Direct Inquiries & Private Allotments
                </h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Connect directly with our senior relationship manager for confidential investment briefs, inventory availability, and private site visits.
              </p>

              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  onClick={() => setEnquiryModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Request VIP Brochure & Pricing</span>
                </button>

                <a
                  href={siteWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Inquire on WhatsApp</span>
                </a>

                <a
                  href={callUrl}
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs shadow-xs transition-all active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Call +91 98765 43210</span>
                </a>
              </div>

              <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Experion Center VIP Tour Booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Complete Blueprint PDF Delivered Instantly</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bank Loan & Payment Plan Assistance</span>
                </div>
              </div>
            </div>

            {/* Schedule Private Site Visit Card */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-base font-serif-luxury">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Schedule a Private Site Visit</span>
              </div>
              <p className="text-xs text-slate-400">
                Experience the landmark in person with a guided private tour by a dedicated senior relationship manager.
              </p>

              <form onSubmit={handleVisitSubmit} className="space-y-3 pt-1">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Preferred Time Slot
                  </label>
                  <select
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-amber-500 focus:outline-hidden"
                  >
                    <option>10:00 AM - 12:00 PM</option>
                    <option>12:00 PM - 02:00 PM</option>
                    <option>02:00 PM - 04:00 PM</option>
                    <option>04:00 PM - 06:00 PM</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Confirm Appointment on WhatsApp</span>
                </button>
              </form>
            </div>

            {/* Google Maps & Navigation */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-base font-serif-luxury flex items-center gap-2">
                <Map className="w-4 h-4 text-amber-400" />
                <span>Geographic Location</span>
              </h3>

              <div className="text-xs text-slate-300 space-y-1">
                <p className="font-semibold text-white">{site.address}</p>
                <p className="text-slate-400">Corridor: {locationName}</p>
              </div>

              <div className="aspect-16/10 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative">
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
                  className="w-full h-full border-0 filter invert contrast-125"
                  loading="lazy"
                />
              </div>

              {site.googleMapsUrl && (
                <a
                  href={site.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-amber-400 font-bold text-xs border border-slate-800 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Google Maps App</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPANION LANDMARKS IN THIS CORRIDOR */}
      {relatedSites.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-800 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Explore More</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif-luxury">
                Related Landmark Developments
              </h3>
            </div>
            <Link
              to="/portfolio"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
            >
              <span>View Full 60+ Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedSites.map((relSite) => (
              <SiteCard key={relSite.id} site={relSite} />
            ))}
          </div>
        </section>
      )}

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-fadeIn">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white">
            <div className="space-y-0.5">
              <h4 className="text-lg font-bold font-serif-luxury text-amber-400">{site.name}</h4>
              <p className="text-xs text-slate-400">Photo {selectedImageIdx + 1} of {images.length}</p>
            </div>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center Image */}
          <div className="relative flex-1 flex items-center justify-center p-4">
            <img
              src={images[selectedImageIdx].imageUrl}
              alt={`${site.name} full preview`}
              className="max-h-[75vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setSelectedImageIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
              className="absolute left-2 sm:left-6 p-3 rounded-full bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-white cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setSelectedImageIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
              className="absolute right-2 sm:right-6 p-3 rounded-full bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-white cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Thumbnails */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
            {images.map((img, idx) => (
              <button
                key={img.id || idx}
                onClick={() => setSelectedImageIdx(idx)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedImageIdx === idx ? 'border-amber-500 scale-105' : 'border-slate-800 opacity-60'
                }`}
              >
                <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* QUICK ENQUIRY / E-BROCHURE MODAL */}
      <QuickEnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        defaultProjectName={site.name}
      />
    </div>
  );
};
