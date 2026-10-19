import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageCircle,
  Layers,
  Award,
  TrendingUp,
  BookOpen,
  Calendar,
  Clock,
  Building,
  Store,
  Briefcase,
  Home as HomeIcon,
  Compass,
  ChevronRight,
  Search,
  SlidersHorizontal,
  ExternalLink,
  Crown,
} from 'lucide-react';
import { api } from '../services/api.js';
import { Location, Site, BlogPost } from '../types.js';
import { LocationCard } from '../components/LocationCard.js';
import { SiteCard } from '../components/SiteCard.js';
import { ContactCta } from '../components/ContactCta.js';
import { QuickEnquiryModal } from '../components/QuickEnquiryModal.js';
import { useSettings } from '../context/SettingsContext.js';
import { getWhatsAppUrl, getPhoneCallUrl } from '../utils/contact.js';
import { SEO } from '../components/common/SEO.js';

export const HomePage: React.FC = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [allSites, setAllSites] = useState<Site[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [latestBlogs, setLatestBlogs] = useState<BlogPost[]>([]);
  const [publicStats, setPublicStats] = useState<{ activeLocations: number; verifiedSites: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);

  // Quick Finder state
  const [finderCategory, setFinderCategory] = useState('All');
  const [finderCorridor, setFinderCorridor] = useState('All');
  const [finderKeyword, setFinderKeyword] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [locs, sites, blogs, stats] = await Promise.all([
          api.getLocations(),
          api.getSites(),
          api.getBlogs({ limit: 3 }).catch(() => []),
          api.getPublicStats().catch(() => null),
        ]);
        setLocations(locs);
        setAllSites(sites);
        setLatestBlogs(blogs);
        setPublicStats(stats);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleQuickFinderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (finderCategory !== 'All') params.set('category', finderCategory);
    if (finderCorridor !== 'All') params.set('corridor', finderCorridor);
    navigate(`/portfolio${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const heroWhatsApp = getWhatsAppUrl(
    settings.whatsapp_number,
    'Hello, I am interested in exploring M3M Inventory (Residential, Retail, Office, Serviced Suites, Leasing). Please assist.'
  );
  const heroCall = getPhoneCallUrl(settings.phone_number);

  const categories = [
    { name: 'All', icon: Layers, label: 'All Portfolios' },
    { name: 'Residential', icon: HomeIcon, label: 'Luxury Residences' },
    { name: 'Retail', icon: Store, label: 'High-Street Retail' },
    { name: 'Office', icon: Briefcase, label: 'Grade-A Offices' },
    { name: 'Serviced Apartments', icon: Building, label: 'Serviced Suites' },
    { name: 'Leasing', icon: Layers, label: 'Institutional Leasing' },
  ];

  // Curated showcase: either trophy picks when 'All' is selected, or top picks of the selected category (max 6)
  const curatedSites = selectedCategory === 'All'
    ? allSites.slice(0, 6)
    : allSites.filter(site => (site.siteType || '').toLowerCase() === selectedCategory.toLowerCase()).slice(0, 6);

  // Dynamic stats list
  const activeLocationsCount = publicStats?.activeLocations ?? (locations.length > 0 ? locations.length : 6);
  const verifiedSitesCount = publicStats?.verifiedSites ?? (allSites.length > 0 ? allSites.length : 60);

  let statsList = [
    { label: 'Sq.Ft Delivered', value: '30M+' },
    { label: 'Master Developments', value: `${verifiedSitesCount}+` },
    { label: 'Prime Corridors', value: `${activeLocationsCount}+` },
    { label: 'RERA Compliance', value: '100%' },
  ];

  if (settings.hero_stats) {
    try {
      const parsed = JSON.parse(settings.hero_stats);
      if (Array.isArray(parsed) && parsed.length > 0) {
        statsList = parsed;
      }
    } catch {
      // Use fallback statsList
    }
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: settings.company_name || 'M3M Inventory',
    description: settings.hero_subheadline || 'Discover iconic luxury residences, high-street retail promenades, Grade-A corporate towers, ultra-luxury serviced suites & institutional leasing across Gurugram & NCR by M3M.',
    telephone: settings.phone_number,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.company_address || 'M3M Experion Center, Golf Course Extension Road, Sector 65',
      addressLocality: 'Gurugram',
      addressRegion: 'Haryana',
      postalCode: '122018',
      addressCountry: 'IN',
    },
    areaServed: ['Golf Course Extension Road', 'Southern Peripheral Road', 'Dwarka Expressway Corridor', 'MG Road & Central Gurugram', 'New Gurugram & Aravalli Foothills', 'Noida Expressway & Sector 94'],
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      <SEO
        title="M3M Inventory – Luxury Residential, High-Street Retail & Grade-A Offices Gurugram"
        description="Discover Gurugram's most prestigious real estate portfolio by M3M. Ultra-luxury residences, high-street retail promenades, Grade-A corporate towers & five-star serviced suites across prime NCR corridors."
        canonicalPath="/"
        schemaData={structuredData}
      />

      {/* 1. CINEMATIC HERO SECTION WITH PROPERTY FINDER CONSOLE */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-16 sm:py-20 border-b border-amber-500/20">
        {/* Ambient Background Gradient Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.22),transparent_55%)]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Col: Main Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-semibold uppercase tracking-wider shadow-inner">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Magnificence in Men, Materials & Money</span>
              </div>

              <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.12] text-white">
                Architectural Masterpieces Across <span className="text-gold-gradient italic">Prime NCR Corridors</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                Discover 60+ landmark developments spanning <strong>Ultra-Luxury Residences, High-Street Retail Boulevards, Grade-A Corporate Towers, Serviced Suites, and Institutional Leasing</strong> by M3M.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setEnquiryModalOpen(true)}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all active:scale-95 cursor-pointer"
                >
                  <Crown className="w-4 h-4 text-slate-950" />
                  <span>Request VIP Deck</span>
                </button>

                <Link
                  to="/portfolio"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 font-semibold text-sm border border-amber-500/30 transition-all shadow-md active:scale-95"
                >
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Explore Portfolio</span>
                </Link>

                <a
                  href={heroWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>

              {/* Trust & Scale Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300">
                {statsList.map((stat, idx) => (
                  <div key={idx} className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/90 backdrop-blur-xs">
                    <span className="block font-serif-luxury font-bold text-amber-400 text-xl sm:text-2xl">{stat.value}</span>
                    <span className="text-slate-400 text-xs">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual Card (5 Portfolios Matrix) */}
            <div className="lg:col-span-5">
              <div className="card-obsidian rounded-3xl p-6 sm:p-7 border border-amber-500/30 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
                  <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
                    <Award className="w-5 h-5" />
                    <span>Five Distinct Asset Portfolios</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    60+ Projects
                  </span>
                </div>

                <div className="space-y-2.5 text-sm text-slate-300">
                  <Link
                    to="/portfolio?category=Residential"
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/80 transition-all group"
                  >
                    <HomeIcon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <strong className="text-white block font-semibold text-xs sm:text-sm group-hover:text-amber-400 transition-colors truncate">Signature Residences (24 Projects)</strong>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 shrink-0" />
                      </div>
                      <span className="text-[11px] text-slate-400 line-clamp-1">
                        Altitude, Golfestate, Cullinan, Crown, Capital, Mansion, OPUS.
                      </span>
                    </div>
                  </Link>

                  <Link
                    to="/portfolio?category=Retail"
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/80 transition-all group"
                  >
                    <Store className="w-5 h-5 text-orange-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <strong className="text-white block font-semibold text-xs sm:text-sm group-hover:text-amber-400 transition-colors truncate">High-Street Retail (16 Projects)</strong>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 shrink-0" />
                      </div>
                      <span className="text-[11px] text-slate-400 line-clamp-1">
                        Jewel, Urbana, Broadway, 65th Avenue, Prive73, Paragon57.
                      </span>
                    </div>
                  </Link>

                  <Link
                    to="/portfolio?category=Office"
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/80 transition-all group"
                  >
                    <Briefcase className="w-5 h-5 text-blue-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <strong className="text-white block font-semibold text-xs sm:text-sm group-hover:text-amber-400 transition-colors truncate">Corporate Towers (9 Projects)</strong>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 shrink-0" />
                      </div>
                      <span className="text-[11px] text-slate-400 line-clamp-1">
                        M3M IFC Twin Towers, Urbana Business Park, Jewel Suites, CFC.
                      </span>
                    </div>
                  </Link>

                  <Link
                    to="/portfolio?category=Serviced%20Apartments"
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/80 transition-all group"
                  >
                    <Building className="w-5 h-5 text-purple-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <strong className="text-white block font-semibold text-xs sm:text-sm group-hover:text-amber-400 transition-colors truncate">Serviced Suites (6 Projects)</strong>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 shrink-0" />
                      </div>
                      <span className="text-[11px] text-slate-400 line-clamp-1">
                        57Suites, Sky Lofts, My Den, Lofts 74, One Key, Cullinan Suites.
                      </span>
                    </div>
                  </Link>

                  <Link
                    to="/portfolio?category=Leasing"
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/80 transition-all group"
                  >
                    <Layers className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <strong className="text-white block font-semibold text-xs sm:text-sm group-hover:text-amber-400 transition-colors truncate">Institutional Leasing (5 Portfolios)</strong>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 shrink-0" />
                      </div>
                      <span className="text-[11px] text-slate-400 line-clamp-1">
                        Retail Promenades, Grade-A Corporate Floors, Pre-Leased AAA Assets.
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Property Finder Interactive Console */}
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md">
            <form onSubmit={handleQuickFinderSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-3">
                <span className="block text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  Asset Class
                </span>
                <select
                  value={finderCategory}
                  onChange={(e) => setFinderCategory(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-white focus:outline-hidden focus:border-amber-500"
                >
                  <option value="All">All 5 Asset Classes</option>
                  <option value="Residential">Residential Sky Mansions</option>
                  <option value="Retail">High-Street Retail</option>
                  <option value="Office">Grade-A Corporate Offices</option>
                  <option value="Serviced Apartments">Managed Serviced Suites</option>
                  <option value="Leasing">Institutional Commercial Leasing</option>
                </select>
              </div>

              <div className="sm:col-span-4">
                <span className="block text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" />
                  Prime Corridor
                </span>
                <select
                  value={finderCorridor}
                  onChange={(e) => setFinderCorridor(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-white focus:outline-hidden focus:border-amber-500"
                >
                  <option value="All">All 6 Prime Corridors (NCR)</option>
                  <option value="golf-course-extension-road">Golf Course Extension Road (Sec 65-68)</option>
                  <option value="southern-peripheral-road">Southern Peripheral Road - SPR (Sec 71-79)</option>
                  <option value="dwarka-expressway-corridor">Dwarka Expressway Corridor (Sec 107-114)</option>
                  <option value="mg-road-central-gurugram">MG Road & Central Gurugram (Sec 25, 57)</option>
                  <option value="new-gurugram-aravalli-foothills">New Gurugram & Aravallis (Sec 84, 89)</option>
                  <option value="noida-expressway-sector-94">Noida Expressway & Sector 94 (0 km Delhi)</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <span className="block text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Search className="w-3.5 h-3.5" />
                  Project Name
                </span>
                <input
                  type="text"
                  placeholder="e.g. Altitude, Cullinan..."
                  value={finderKeyword}
                  onChange={(e) => setFinderKeyword(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2 pt-4 sm:pt-4">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. PRIME CORRIDORS OF GURUGRAM & NCR (Corridor-first architecture) */}
      <section id="corridors" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
              Explore by Strategic Gurugram Corridors
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
              M3M Inventory are strategically anchored along NCR's highest-growth arterial highways, commanding superior capital appreciation and footfalls.
            </p>
          </div>
          <Link
            to="/corridors"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-700 hover:text-amber-800 group shrink-0"
          >
            <span>View All Corridors</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-4/3 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        ) : locations.length === 0 ? (
          <p className="text-slate-500 text-sm">No corridors available currently.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {locations.map((loc) => (
              <LocationCard key={loc.id} location={loc} />
            ))}
          </div>
        )}
      </section>

      
      {/* 2. THE TRINITY PHILOSOPHY: MEN, MATERIALS & MONEY */}
      <section className="bg-slate-950 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 text-white border-y border-amber-500/20">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
              The M3M Brand Philosophy
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Magnificence in the Trinity of Men, Materials & Money
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Every M3M development stands on the immutable foundation of world-renowned human genius, uncompromising engineering standards, and unmatched financial strength.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: Men */}
            <div className="bg-slate-900/90 p-8 rounded-3xl border border-amber-500/30 shadow-xl space-y-4 relative overflow-hidden group hover:border-amber-500/60 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold border border-amber-500/20 group-hover:scale-110 transition-transform">
                <Crown className="w-7 h-7" />
              </div>
              <h3 className="font-serif-luxury font-bold text-white text-2xl">
                Men: Global Genius
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We partner with the world's most revered master planners, architects, and luxury icons—including <strong>Chapman Taylor (UK), RSP Singapore, ARCOP, Elie Saab, and Jacob & Co</strong>.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-amber-300/80">
                <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">Chapman Taylor (UK)</span>
                <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">RSP (Singapore)</span>
                <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">ARCOP</span>
              </div>
            </div>

            {/* Pillar 2: Materials */}
            <div className="bg-slate-900/90 p-8 rounded-3xl border border-amber-500/30 shadow-xl space-y-4 relative overflow-hidden group hover:border-amber-500/60 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold border border-amber-500/20 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-serif-luxury font-bold text-white text-2xl">
                Materials: Pure Excellence
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Engineered with Grade-A European construction benchmarks, imported Italian marble, seismic compliance, and sustainable <strong>LEED Gold certifications</strong>.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-amber-300/80">
                <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">LEED Gold Towers</span>
                <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">Italian Marble Living</span>
                <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">VRV Climate Control</span>
              </div>
            </div>

            {/* Pillar 3: Money */}
            <div className="bg-slate-900/90 p-8 rounded-3xl border border-amber-500/30 shadow-xl space-y-4 relative overflow-hidden group hover:border-amber-500/60 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold border border-amber-500/20 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="font-serif-luxury font-bold text-white text-2xl">
                Money: Institutional Velocity
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Institutional financial strength backing rapid execution, 100% RERA transparency, AAA tenant lock-ins, and consistent <strong>7.5% - 9% rental yields</strong>.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-amber-300/80">
                <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">30M+ Delivered</span>
                <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">7.5% - 9% Yields</span>
                <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">100% Bank Approved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CURATED SIGNATURE MASTERPIECES (Trophy Collection instead of flat dump) */}
      <section id="signature-collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1.5">
              <Crown className="w-4 h-4 text-amber-600" />
              <span>Curated Landmark Masterpieces</span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Signature Trophy Developments
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1.5 max-w-2xl">
              Handpicked flagship developments epitomizing architectural brilliance, premium high-street retail, and world-class corporate standards.
            </p>
          </div>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-700 hover:text-amber-800 group"
          >
            <span>Complete Portfolio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Switcher Filter Tabs */}
        {/* <div className="flex flex-wrap gap-2.5 pt-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.name;
            const count = cat.name === 'All'
              ? allSites.length
              : allSites.filter(s => (s.siteType || '').toLowerCase() === cat.name.toLowerCase()).length;

            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer ${
                  isSelected
                    ? 'bg-slate-950 text-amber-400 border border-amber-500/40 shadow-md scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div> */}

        {/* Projects Grid (Curated Signature Picks) */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        ) : curatedSites.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-12 text-center text-slate-500">
            No projects found in the {selectedCategory} category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {curatedSites.map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>
        )}

        {/* View Entire Portfolio Banner CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl text-white">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
              Comprehensive NCR Portfolio
            </span>
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white">
              Discover All 60+ M3M Landmarks Across Gurugram & NCR
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Filter by specific sector, construction status, asset configuration, or investment yield.
            </p>
          </div>
          <Link
            to="/portfolio"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md transition-all active:scale-95"
          >
            <span>Explore Full Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. ASSET CLASS MATRIX (5 Portfolios Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 border border-amber-200 px-3.5 py-1 rounded-full">
            Asset Class Spectrum
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Tailored Real Estate Portfolios
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Whether seeking high-capital appreciation luxury sky mansions or secure rental yield retail assets, M3M offers institutional-grade opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {/* Residential */}
          <Link
            to="/portfolio?category=Residential"
            className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-amber-500/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold border border-amber-500/20 group-hover:scale-110 transition-transform">
                <HomeIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif-luxury font-bold text-slate-900 text-lg group-hover:text-amber-600 transition-colors">
                  Residences
                </h3>
                <span className="text-xs font-bold text-amber-700">24 Landmarks</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Golf-course frontage mansions, sky villas, and low-density luxury high-rises on Golf Course Extn & SPR.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:text-amber-800">
              <span>Browse Residences</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Retail */}
          <Link
            to="/portfolio?category=Retail"
            className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-amber-500/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold border border-orange-500/20 group-hover:scale-110 transition-transform">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif-luxury font-bold text-slate-900 text-lg group-hover:text-amber-600 transition-colors">
                  High-Street Retail
                </h3>
                <span className="text-xs font-bold text-amber-700">16 Promenades</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Double-height retail boulevards, food courts, and entertainment zones with 7.5% - 9% yield potential.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:text-amber-800">
              <span>Browse Retail Spaces</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Office */}
          <Link
            to="/portfolio?category=Office"
            className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-amber-500/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif-luxury font-bold text-slate-900 text-lg group-hover:text-amber-600 transition-colors">
                  Corporate Offices
                </h3>
                <span className="text-xs font-bold text-amber-700">9 Flagship Parks</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                LEED Gold certified commercial towers with institutional floor plates, smart BMS, and premium F&B hubs.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:text-amber-800">
              <span>Browse Corporate Hubs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Serviced Apartments */}
          <Link
            to="/portfolio?category=Serviced%20Apartments"
            className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-amber-500/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold border border-purple-500/20 group-hover:scale-110 transition-transform">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif-luxury font-bold text-slate-900 text-lg group-hover:text-amber-600 transition-colors">
                  Serviced Suites
                </h3>
                <span className="text-xs font-bold text-amber-700">6 Developments</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fully-furnished five-star managed suites with concierge services, rental pooling, and high occupancy rates.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:text-amber-800">
              <span>Browse Serviced Suites</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Institutional Leasing */}
          <Link
            to="/portfolio?category=Leasing"
            className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-amber-500/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif-luxury font-bold text-slate-900 text-lg group-hover:text-amber-600 transition-colors">
                  Institutional Leasing
                </h3>
                <span className="text-xs font-bold text-emerald-700">5 Portfolios</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pre-leased commercial floors, anchor retail stores, gourmet food courts, and SCO multi-floor spaces.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:text-amber-800">
              <span>Explore Leasing</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 5. M3M HALLMARKS OF EXCELLENCE (Meaningful Architectural Icons) */}
      <section className="bg-slate-950 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 text-white border-y border-amber-500/20">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
              The M3M Benchmark
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Why Discerning Investors & Homeowners Choose M3M
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Consistently setting industry benchmarks in architectural grandeur, lightning execution speed, and extraordinary value creation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold border border-amber-500/20">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury font-bold text-white text-lg">Global Master Architects</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Conceptualized with international architectural pioneers including Chapman Taylor (UK), RSP Singapore, and ARCOP.
              </p>
            </div>

            <div className="bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold border border-amber-500/20">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury font-bold text-white text-lg">Strategic Arterial Locations</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Premier frontage along Golf Course Extension Road, Southern Peripheral Road (SPR), Dwarka Expressway, and MG Road.
              </p>
            </div>

            <div className="bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold border border-amber-500/20">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury font-bold text-white text-lg">Unmatched Yields & Appreciation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-street retail commanding 7.5% - 9% rental yields and residential assets delivering top-tier capital growth in NCR.
              </p>
            </div>

            <div className="bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold border border-amber-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury font-bold text-white text-lg">100% RERA & Bank Approved</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complete legal transparency with HARERA registrations and pre-approved home and commercial financing from top banks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MARKET INTELLIGENCE & RESEARCH ARTICLES */}
      {latestBlogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1.5">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>Market Intelligence</span>
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Latest Real Estate Insights & Buyer Guides
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1.5">
                Authoritative research on luxury residential trends, high-street retail performance, and NCR infrastructure growth.
              </p>
            </div>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-700 hover:text-amber-800 group"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestBlogs.map((blog) => (
              <article
                key={blog.id}
                className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-500/50 transition-all flex flex-col hover:-translate-y-1"
              >
                <Link to={`/blogs/${blog.slug}`} className="block relative aspect-16/10 overflow-hidden bg-slate-900">
                  <img
                    src={blog.coverImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}
                    alt={blog.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-950/90 text-amber-400 border border-amber-500/30 shadow-xs">
                    {blog.category}
                  </span>
                </Link>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        {blog.readTime || '4 min read'}
                      </span>
                    </div>

                    <h3 className="font-serif-luxury font-bold text-slate-900 text-lg group-hover:text-amber-600 transition-colors line-clamp-2">
                      <Link to={`/blogs/${blog.slug}`}>{blog.title}</Link>
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>

                  <Link
                    to={`/blogs/${blog.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 pt-2"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 7. ABOUT M3M BRAND & HERITAGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-14 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 border border-amber-200 px-3.5 py-1 rounded-full">
              About M3M Inventory
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              {settings.about_title || 'Pioneering Luxury & Redefining NCR’s Architectural Skyline'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {settings.about_description ||
                'M3M India stands for "Magnificence in the Trinity of Men, Materials & Money". Over the past two decades, M3M has emerged as one of India’s fastest growing luxury real estate developers, transforming Gurugram into a world-class global metropolis.'}
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              {settings.about_mission ||
                'Our vision is to craft architectural masterworks that merge cutting-edge global design, sustainable construction, unmatched lifestyle amenities, and exceptional investment value for discerning homeowners and corporate enterprises.'}
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 font-bold text-amber-700 hover:text-amber-800 text-sm"
              >
                <span>Read Full M3M Story & Leadership Vision</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-xl border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
              alt="M3M Luxury Real Estate Landmark"
              loading="lazy"
              className="w-full h-80 object-cover"
            />
          </div>
        </div>
      </section>

      {/* 8. VIP CONCIERGE CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ContactCta />
      </div>

      {/* Quick Enquiry Modal */}
      <QuickEnquiryModal isOpen={enquiryModalOpen} onClose={() => setEnquiryModalOpen(false)} />
    </div>
  );
};
