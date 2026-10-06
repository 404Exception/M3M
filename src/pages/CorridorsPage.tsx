import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  MapPin,
  ArrowRight,
  TrendingUp,
  Building2,
  ShieldCheck,
  Award,
  Crown,
  Layers,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../services/api.js';
import { Location, Site } from '../types.js';
import { LocationCard } from '../components/LocationCard.js';
import { ContactCta } from '../components/ContactCta.js';
import { SEO } from '../components/common/SEO.js';

export const CorridorsPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [allSites, setAllSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [locs, sites] = await Promise.all([
          api.getLocations(),
          api.getSites(),
        ]);
        setLocations(locs);
        setAllSites(sites);
      } catch (err) {
        console.error('Failed to load corridors data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Strategic corridor metadata & intelligence
  const corridorInsights: Record<string, {
    connectivity: string[];
    investmentRounds: string;
    avgAppreciation: string;
    keyLandmarks: string;
    idealFor: string;
  }> = {
    'golf-course-extension-road': {
      connectivity: ['Rapid Metro Phase-2', 'Direct link to IGI Airport (30 mins)', 'Seamless NH-8 & Faridabad Road access'],
      investmentRounds: 'Mature High-Yield Corridor',
      avgAppreciation: '14.8% YoY Capital Growth',
      keyLandmarks: 'M3M Altitude, M3M IFC Twin Towers, M3M Urbana, M3M 65th Avenue',
      idealFor: 'Ultra-HNIs seeking trophy golf-facing residences & Grade-A corporate leasing.',
    },
    'southern-peripheral-road': {
      connectivity: ['Direct link to Delhi-Mumbai Expressway', 'Multi-utility Corridor (SPR-CPR junction)', 'Close to Cyber City 2'],
      investmentRounds: 'Rapid Acceleration Commercial Zone',
      avgAppreciation: '16.5% YoY Capital Growth',
      keyLandmarks: 'M3M Golf Hills, M3M Antalya Hills, M3M Broadway, M3M Prive73',
      idealFor: 'Investors seeking high rental yielding high-street retail & golf-centric luxury residences.',
    },
    'dwarka-expressway-corridor': {
      connectivity: ['8-Lane Grade Separated Expressway', '15 mins to IGI Airport T3', 'Direct link to Diplomatic Enclave II & Yashobhoomi (IICC)'],
      investmentRounds: 'Future-Ready Global Belt',
      avgAppreciation: '18.2% YoY Capital Growth',
      keyLandmarks: 'M3M Crown, M3M Capital, M3M 84Market, M3M Smart City Delhi Airport',
      idealFor: 'Delhi-NCR commuters and long-term capital appreciation investors.',
    },
    'mg-road-central-gurugram': {
      connectivity: ['Yellow Line Metro Station', 'Direct NH-48 & Cyber Hub connectivity', 'Heart of Gurugram Central Business District'],
      investmentRounds: 'Prime Trophy Commercial Hub',
      avgAppreciation: '12.4% YoY Commercial Yield',
      keyLandmarks: 'M3M Jewel, M3M Paragon57, M3M 57Suites, M3M Atrium57',
      idealFor: 'Retail brands, luxury flagship stores, and five-star managed serviced suites.',
    },
    'new-gurugram-sector-84-89': {
      connectivity: ['Direct KMP Expressway & Cloverleaf interchange', 'Near upcoming Global City mega-hub', 'NH-48 arterial access'],
      investmentRounds: 'High-Growth Residential Micro-Market',
      avgAppreciation: '15.0% YoY Capital Growth',
      keyLandmarks: 'M3M Soulitude, M3M Woodshire, M3M Golfestate',
      idealFor: 'Discerning homeowners looking for expansive master-planned green communities.',
    },
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Prime Growth Corridors of Gurugram & NCR by M3M',
    description: 'Explore the 5 prime arterial real estate growth corridors across Gurugram anchored by M3M luxury developments.',
    itemListElement: locations.map((loc, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: loc.name,
      url: `https://m3mproperties.in/corridors/${loc.slug}`,
    })),
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      <SEO
        title="Prime Growth Corridors Gurugram & NCR – M3M Strategic Locations"
        description="Explore Gurugram's 5 highest-growth real estate corridors: Golf Course Extension Road, SPR, Dwarka Expressway, MG Road, and New Gurugram. Discover M3M landmarks along each arterial belt."
        keywords="m3m corridors, golf course extension road gurugram, southern peripheral road, dwarka expressway m3m, mg road commercial, new gurugram projects"
        canonicalPath="/corridors"
        schemaData={structuredData}
      />

      {/* 1. Hero Section: Strategic Corridor Investment Narrative */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-16 sm:py-24 border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_55%)]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-semibold uppercase tracking-wider shadow-inner">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Geographic Growth Architecture</span>
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] text-white">
              Gurugram's <span className="text-gold-gradient italic">Prime Growth Corridors</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              Every M3M masterwork is strategically positioned along NCR’s most potent arterial expressways. Explore the specific infrastructure drivers, connectivity advantages, and landmark developments along each corridor.
            </p>
          </div>

          {/* Quick Corridor Navigation Chips */}
          <div className="pt-2 flex flex-wrap gap-2.5">
            {locations.map((loc) => (
              <a
                key={loc.id}
                href={`#corridor-${loc.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-slate-800 hover:border-amber-400 text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{loc.name}</span>
                <span className="text-[10px] bg-slate-800 text-amber-400 px-2 py-0.5 rounded-md font-bold">
                  {loc.siteCount ?? 0}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Visual Corridors Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Arterial Overview
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              NCR Strategic Expressway Map
            </h2>
          </div>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-700 hover:text-amber-800 group"
          >
            <span>Browse All 34 Projects Across Portfolios</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-4/3 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {locations.map((loc) => (
              <LocationCard key={loc.id} location={loc} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Deep-Dive Corridor Profiles with Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 border border-amber-200 px-3.5 py-1 rounded-full">
            Corridor Intelligence & Project Profiles
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Detailed Corridor Profiles
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            In-depth economic and connectivity analysis for each of Gurugram's five powerhouse investment corridors.
          </p>
        </div>

        <div className="space-y-12">
          {locations.map((location) => {
            const insights = corridorInsights[location.slug] || {
              connectivity: ['Prime Highway Frontage', 'Close to Metro & Commercial Hubs', 'Rapid Urban Infrastructure'],
              investmentRounds: 'High Growth Corridor',
              avgAppreciation: '15.0% YoY Capital Growth',
              keyLandmarks: 'M3M Signature Developments',
              idealFor: 'Discerning luxury homeowners and commercial investors.',
            };

            const corridorSites = allSites.filter(
              (site) => site.locationId === location.id || site.location?.slug === location.slug
            );

            return (
              <div
                key={location.id}
                id={`corridor-${location.slug}`}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 scroll-mt-28"
              >
                {/* Header Banner for this Corridor */}
                <div className="relative p-6 sm:p-10 bg-slate-950 text-white overflow-hidden border-b border-amber-500/20">
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <img
                      src={location.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'}
                      alt={location.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />

                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{location.city}, {location.state}</span>
                      </div>
                      <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
                        {location.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                        {insights.idealFor}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="bg-slate-900/90 border border-amber-500/30 px-4 py-2.5 rounded-xl text-center">
                        <span className="block text-[10px] text-slate-400 uppercase font-semibold">Developments</span>
                        <span className="text-amber-400 font-serif-luxury font-bold text-lg">{location.siteCount ?? corridorSites.length} Landmarks</span>
                      </div>

                      <div className="bg-slate-900/90 border border-amber-500/30 px-4 py-2.5 rounded-xl text-center">
                        <span className="block text-[10px] text-slate-400 uppercase font-semibold">Growth Metric</span>
                        <span className="text-emerald-400 font-serif-luxury font-bold text-lg">{insights.avgAppreciation}</span>
                      </div>

                      <Link
                        to={`/locations/${location.slug}`}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
                      >
                        <span>Explore Corridor Page</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Corridor Body: Connectivity Highlights & Projects Preview */}
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Connectivity Points */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {insights.connectivity.map((point, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>

                  {/* Projects in this corridor */}
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                      <h4 className="font-serif-luxury font-bold text-slate-900 text-lg">
                        M3M Developments along {location.name}
                      </h4>
                      <Link
                        to={`/locations/${location.slug}`}
                        className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                      >
                        <span>View All ({corridorSites.length})</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {corridorSites.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-4">No active projects loaded for this corridor.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {corridorSites.map((site) => (
                          <Link
                            key={site.id}
                            to={`/sites/${site.slug}`}
                            className="group/site p-3 rounded-xl bg-slate-50 hover:bg-amber-500 hover:text-slate-950 border border-slate-200 hover:border-amber-400 transition-all flex flex-col justify-between space-y-2"
                          >
                            <div>
                              <span className="block text-[10px] font-bold text-amber-700 group-hover/site:text-slate-900 uppercase">
                                {site.siteType || 'M3M'}
                              </span>
                              <strong className="block text-xs font-bold text-slate-900 group-hover/site:text-slate-950 line-clamp-1">
                                {site.name}
                              </strong>
                            </div>
                            <span className="text-[10px] text-slate-500 group-hover/site:text-slate-900 font-medium line-clamp-1">
                              {site.startingPrice || 'Price on Req'}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Direct Developer CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ContactCta
          title="Looking to Invest in a Specific Corridor?"
          subtitle="Our senior portfolio advisors will provide comprehensive comparative analysis, infrastructure projections, and exclusive pre-launch allocations."
        />
      </div>
    </div>
  );
};
