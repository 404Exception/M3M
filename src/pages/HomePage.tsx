import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  MapPin,
  Crown,
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
} from 'lucide-react';
import { api } from '../services/api.js';
import { Location, Site, BlogPost } from '../types.js';
import { LocationCard } from '../components/LocationCard.js';
import { SiteCard } from '../components/SiteCard.js';
import { ContactCta } from '../components/ContactCta.js';
import { useSettings } from '../context/SettingsContext.js';
import { getWhatsAppUrl, getPhoneCallUrl } from '../utils/contact.js';
import { SEO } from '../components/common/SEO.js';

export const HomePage: React.FC = () => {
  const { settings } = useSettings();
  const [locations, setLocations] = useState<Location[]>([]);
  const [allSites, setAllSites] = useState<Site[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [latestBlogs, setLatestBlogs] = useState<BlogPost[]>([]);
  const [publicStats, setPublicStats] = useState<{ activeLocations: number; verifiedSites: number } | null>(null);
  const [loading, setLoading] = useState(true);

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

  const heroWhatsApp = getWhatsAppUrl(
    settings.whatsapp_number,
    'Hello, I am interested in exploring M3M Properties (Residential, Retail, Office, Serviced Suites). Please assist.'
  );
  const heroCall = getPhoneCallUrl(settings.phone_number);

  const categories = [
    { name: 'All', icon: Layers, label: 'All Portfolios' },
    { name: 'Residential', icon: HomeIcon, label: 'Luxury Residences' },
    { name: 'Retail', icon: Store, label: 'High-Street Retail' },
    { name: 'Office', icon: Briefcase, label: 'Grade-A Offices' },
    { name: 'Serviced Apartments', icon: Building, label: 'Serviced Suites' },
  ];

  // Signature Trophy Project slugs for the curated showcase
  const trophySlugs = [
    'm3m-altitude',
    'm3m-jewel',
    'm3m-golf-hills',
    'm3m-ifc',
    'm3m-65th-avenue',
    'm3m-57suites',
  ];

  // Curated showcase: either trophy picks when 'All' is selected, or top picks of the selected category (max 6)
  const curatedSites = selectedCategory === 'All'
    ? (allSites.filter(site => trophySlugs.includes(site.slug)).length > 0
        ? allSites.filter(site => trophySlugs.includes(site.slug))
        : allSites.slice(0, 6))
    : allSites.filter(site => (site.siteType || '').toLowerCase() === selectedCategory.toLowerCase()).slice(0, 6);

  // Dynamic stats list
  const activeLocationsCount = publicStats?.activeLocations ?? (locations.length > 0 ? locations.length : 5);
  const verifiedSitesCount = publicStats?.verifiedSites ?? (allSites.length > 0 ? allSites.length : 34);

  let statsList = [
    { label: 'Sq.Ft Delivered', value: '30M+' },
    { label: 'Iconic Projects', value: `${verifiedSitesCount}+` },
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
    name: settings.company_name || 'M3M Properties',
    description: settings.hero_subheadline || 'Discover iconic luxury residences, high-street retail promenades, Grade-A corporate towers & ultra-luxury serviced suites across Gurugram & NCR by M3M.',
    telephone: settings.phone_number,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.company_address || 'M3M Experion Center, Golf Course Extension Road, Sector 65',
      addressLocality: 'Gurugram',
      addressRegion: 'Haryana',
      postalCode: '122018',
      addressCountry: 'IN',
    },
    areaServed: ['Golf Course Extension Road', 'Southern Peripheral Road', 'Dwarka Expressway Corridor', 'MG Road & Cyber City Hub', 'New Gurugram & Sector 84/89'],
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      <SEO
        title="M3M Properties – Luxury Residential, High-Street Retail & Grade-A Offices Gurugram"
        description="Discover Gurugram's most prestigious real estate portfolio by M3M. Ultra-luxury residences, high-street retail promenades, Grade-A corporate towers & five-star serviced suites across prime NCR corridors."
        canonicalPath="/"
        schemaData={structuredData}
      />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-16 border-b border-amber-500/20">
        {/* Ambient Background Gradient Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_55%)]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: Main Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-semibold uppercase tracking-wider shadow-inner">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Magnificence in Men, Materials & Money</span>
              </div>

              <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] text-white">
                Redefining Luxury Living & Iconic Commercial Hubs with <span className="text-gold-gradient italic">M3M Properties</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                Explore Gurugram's most distinguished portfolio across <strong>Ultra-Luxury Residences, High-Street Retail Boulevards, Grade-A Corporate Towers, and Managed Serviced Suites</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#corridors"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base shadow-lg shadow-amber-500/25 transition-all active:scale-95"
                >
                  <Compass className="w-5 h-5 text-slate-950" />
                  <span>Explore Prime Corridors</span>
                </a>

                <a
                  href={heroWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 font-semibold text-base border border-amber-500/30 transition-all shadow-md active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 fill-current text-emerald-400" />
                  <span>VIP Concierge</span>
                </a>

                <a
                  href={heroCall}
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl text-slate-300 hover:text-amber-400 font-medium text-base transition-colors"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>{settings.phone_number}</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300">
                {statsList.map((stat, idx) => (
                  <div key={idx} className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 backdrop-blur-xs">
                    <span className="block font-serif-luxury font-bold text-amber-400 text-xl sm:text-2xl">{stat.value}</span>
                    <span className="text-slate-400 text-xs">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Instant Prime Corridors Quick-Access Strip */}
              <div className="pt-2 space-y-2">
                <span className="text-xs font-bold text-amber-400/90 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  Direct Corridor Navigator:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'Golf Course Extn', slug: 'golf-course-extension-road' },
                    { name: 'SPR (Sec 71-74)', slug: 'southern-peripheral-road' },
                    { name: 'Dwarka Expressway', slug: 'dwarka-expressway-corridor' },
                    { name: 'MG Road / Cyber Hub', slug: 'mg-road-central-gurugram' },
                    { name: 'New Gurugram (Sec 84/89)', slug: 'new-gurugram-sector-84-89' },
                  ].map((c) => (
                    <Link
                      key={c.slug}
                      to={`/corridors/${c.slug}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-slate-800 hover:border-amber-400 text-xs font-semibold transition-all shadow-xs"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5">
              <div className="card-obsidian rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
                    <Award className="w-5 h-5" />
                    <span>Four Distinct Asset Portfolios</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    100% RERA
                  </span>
                </div>

                <div className="space-y-3.5 text-sm text-slate-300">
                  <Link
                    to="/portfolio?category=Residential"
                    className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/80 transition-all group"
                  >
                    <HomeIcon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-white block font-semibold group-hover:text-amber-400 transition-colors">Residential Living (15 Projects)</strong>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                      </div>
                      <span className="text-xs text-slate-400">
                        Altitude, Golf Hills, Antalya Hills, OPUS, Fairway West, Skycity, Polo Suites.
                      </span>
                    </div>
                  </Link>

                  <Link
                    to="/portfolio?category=Retail"
                    className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/80 transition-all group"
                  >
                    <Store className="w-5 h-5 text-orange-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-white block font-semibold group-hover:text-amber-400 transition-colors">High-Street Retail (14 Projects)</strong>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                      </div>
                      <span className="text-xs text-slate-400">
                        Jewel, Urbana, Broadway, 65th Avenue, Prive73, Paragon57, Route65.
                      </span>
                    </div>
                  </Link>

                  <Link
                    to="/portfolio?category=Office"
                    className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/80 transition-all group"
                  >
                    <Briefcase className="w-5 h-5 text-blue-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-white block font-semibold group-hover:text-amber-400 transition-colors">Grade-A Corporate Offices (4 Projects)</strong>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                      </div>
                      <span className="text-xs text-slate-400">
                        M3M Jewel Offices, Tee Point Offices, M3M CFC, and M3M IFC Twin Towers.
                      </span>
                    </div>
                  </Link>

                  <Link
                    to="/portfolio?category=Serviced%20Apartments"
                    className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/80 transition-all group"
                  >
                    <Building className="w-5 h-5 text-purple-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-white block font-semibold group-hover:text-amber-400 transition-colors">Serviced Suites (M3M 57Suites)</strong>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                      </div>
                      <span className="text-xs text-slate-400">
                        Five-star managed 1 & 2 BHK suites in Sector 57 with high rental yield assurance.
                      </span>
                    </div>
                  </Link>
                </div>

                <div className="pt-1">
                  <a
                    href="#signature-collection"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm text-center shadow-md transition-colors"
                  >
                    <span>View Signature Masterpieces</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
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
              M3M properties are strategically anchored along NCR's highest-growth arterial highways, commanding superior capital appreciation and footfalls.
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
            <span>Complete 34 Portfolio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Switcher Filter Tabs */}
        <div className="flex flex-wrap gap-2.5 pt-1">
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
        </div>

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
              Discover All 34 M3M Landmarks Across Gurugram Corridors
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

      {/* 4. ASSET CLASS MATRIX (4 Portfolios Grid) */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  Ultra-Luxury Residences
                </h3>
                <span className="text-xs font-bold text-amber-700">15 Iconic Landmarks</span>
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
                <span className="text-xs font-bold text-amber-700">14 Prime Promenades</span>
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
                  Grade-A Corporate Towers
                </h3>
                <span className="text-xs font-bold text-amber-700">4 Flagship Tech Parks</span>
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
                <span className="text-xs font-bold text-amber-700">M3M 57Suites</span>
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
        </div>
      </section>

      {/* 5. M3M HALLMARKS OF EXCELLENCE (Meaningful Architectural Icons, No Sparkles) */}
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
              About M3M Properties
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
    </div>
  );
};
