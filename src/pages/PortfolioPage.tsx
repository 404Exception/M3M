import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Layers,
  Search,
  Building,
  Store,
  Briefcase,
  Home as HomeIcon,
  MapPin,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Compass,
  Crown,
  CheckCircle2,
  X,
} from 'lucide-react';
import { api } from '../services/api.js';
import { Location, Site } from '../types.js';
import { SiteCard } from '../components/SiteCard.js';
import { ContactCta } from '../components/ContactCta.js';
import { SEO } from '../components/common/SEO.js';

export const PortfolioPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialCorridor = searchParams.get('corridor') || 'All';

  const [locations, setLocations] = useState<Location[]>([]);
  const [allSites, setAllSites] = useState<Site[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCorridor, setSelectedCorridor] = useState<string>(initialCorridor);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Sync URL search params
  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    const corr = searchParams.get('corridor') || 'All';
    setSelectedCategory(cat);
    setSelectedCorridor(corr);
  }, [searchParams]);

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
        console.error('Failed to load portfolio data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleCategorySelect = (catName: string) => {
    setSelectedCategory(catName);
    const newParams = new URLSearchParams(searchParams);
    if (catName === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', catName);
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleCorridorSelect = (corridorSlug: string) => {
    setSelectedCorridor(corridorSlug);
    const newParams = new URLSearchParams(searchParams);
    if (corridorSlug === 'All') {
      newParams.delete('corridor');
    } else {
      newParams.set('corridor', corridorSlug);
    }
    setSearchParams(newParams, { replace: true });
  };

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedCorridor('All');
    setSelectedStatus('All');
    setSearchTerm('');
    setSortBy('featured');
    setSearchParams({}, { replace: true });
  };

  const categories = [
    { name: 'All', icon: Layers, label: 'All Portfolios' },
    { name: 'Residential', icon: HomeIcon, label: 'Residences' },
    { name: 'Retail', icon: Store, label: 'Retail Promenades' },
    { name: 'Office', icon: Briefcase, label: 'Corporate Offices' },
    { name: 'Serviced Apartments', icon: Building, label: 'Serviced Suites' },
    { name: 'Leasing', icon: Layers, label: 'Institutional Leasing' },
  ];

  // Filter and Sort Sites
  const filteredSites = useMemo(() => {
    return allSites
      .filter((site) => {
        // Category Filter
        const matchesCategory =
          selectedCategory === 'All' ||
          (site.siteType || '').toLowerCase() === selectedCategory.toLowerCase();

        // Corridor Filter
        const matchesCorridor =
          selectedCorridor === 'All' ||
          site.location?.slug === selectedCorridor ||
          site.locationId === selectedCorridor;

        // Status Filter
        const matchesStatus =
          selectedStatus === 'All' ||
          (site.status || '').toLowerCase() === selectedStatus.toLowerCase();

        // Keyword Search
        const matchesSearch =
          !searchTerm ||
          site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          site.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (site.location?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (site.description || '').toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesCorridor && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'name-desc') {
          return b.name.localeCompare(a.name);
        }
        // default featured
        return 0;
      });
  }, [allSites, selectedCategory, selectedCorridor, selectedStatus, searchTerm, sortBy]);

  const activeFilterCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedCorridor !== 'All' ? 1 : 0) +
    (selectedStatus !== 'All' ? 1 : 0) +
    (searchTerm ? 1 : 0);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'M3M Inventory – Complete Master Portfolio Directory',
    description: 'Browse all 60+ luxury residential, high-street retail, corporate office, serviced suites, and institutional leasing developments by M3M.',
    itemListElement: allSites.map((site, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: site.name,
      url: `https://m3mproperties.in/sites/${site.slug}`,
    })),
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      <SEO
        title={selectedCategory === 'All' ? 'M3M Master Portfolio Directory – All 60+ Iconic Developments' : `M3M ${selectedCategory} Properties – Master Portfolio`}
        description="Discover all 60+ luxury residential sky mansions, high-street retail boulevards, Grade-A corporate towers, ultra-luxury serviced suites & institutional leasing across Gurugram & NCR by M3M."
        keywords="m3m portfolio, m3m all projects, m3m luxury apartments, m3m commercial shops, m3m offices gurugram, m3m leasing"
        canonicalPath="/portfolio"
        schemaData={structuredData}
      />

      {/* 1. Hero Header Banner */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-14 sm:py-20 border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_55%)]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-semibold uppercase tracking-wider shadow-inner">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Complete Master Portfolio • 60+ Landmark Projects</span>
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] text-white">
              The M3M <span className="text-gold-gradient italic">Developments Directory</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              Explore the entirety of M3M’s distinguished real estate catalog across Gurugram & NCR. Filter dynamically by asset class, growth corridor, construction status, and configuration.
            </p>
          </div>

          {/* Key Portfolio Metric Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-4xl pt-2">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
              <span className="block font-serif-luxury font-bold text-amber-400 text-xl">24</span>
              <span className="text-[11px] text-slate-400">Residences</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
              <span className="block font-serif-luxury font-bold text-amber-400 text-xl">16</span>
              <span className="text-[11px] text-slate-400">Retail Promenades</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
              <span className="block font-serif-luxury font-bold text-amber-400 text-xl">9</span>
              <span className="text-[11px] text-slate-400">Corporate Towers</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
              <span className="block font-serif-luxury font-bold text-amber-400 text-xl">6</span>
              <span className="text-[11px] text-slate-400">Serviced Suites</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center col-span-2 sm:col-span-1">
              <span className="block font-serif-luxury font-bold text-amber-400 text-xl">5</span>
              <span className="text-[11px] text-slate-400">Leasing Solutions</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Multi-Facet Filter & Discovery Console */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Top Row: Search & Corridor & Status Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Live Search */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by project name, sector, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all shadow-inner"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 bg-slate-200 px-2 py-0.5 rounded cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Corridor Selector */}
            <div className="md:col-span-4">
              <div className="relative">
                <Compass className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedCorridor}
                  onChange={(e) => handleCorridorSelect(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="All">All Prime Corridors (NCR)</option>
                  {locations.map((loc) => (
                    <option key={loc.slug} value={loc.slug}>
                      {loc.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  ▼
                </div>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3">
              <div className="relative">
                <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="featured">Sort: Featured Picks</option>
                  <option value="name-asc">Sort: Name (A → Z)</option>
                  <option value="name-desc">Sort: Name (Z → A)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  ▼
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Asset Class Category Pills & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex flex-wrap gap-2">
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
                    onClick={() => handleCategorySelect(cat.name)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer ${
                      isSelected
                        ? 'bg-slate-950 text-amber-400 border border-amber-500/40 shadow-md scale-102'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span>{cat.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${isSelected ? 'bg-amber-400 text-slate-950' : 'bg-white text-slate-600 border border-slate-200'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 text-xs font-bold transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters ({activeFilterCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-slate-900">
              {selectedCategory === 'All' ? 'All M3M Landmarks' : `M3M ${selectedCategory} Portfolio`}
            </h2>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full">
              {filteredSites.length} {filteredSites.length === 1 ? 'Development' : 'Developments'}
            </span>
          </div>

          {selectedCorridor !== 'All' && (
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Filtered by corridor: <strong>{locations.find(l => l.slug === selectedCorridor)?.name || selectedCorridor}</strong></span>
            </div>
          )}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        ) : filteredSites.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center space-y-4 shadow-sm">
            <Building className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-serif-luxury text-xl font-bold text-slate-900">No Developments Match Your Search</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              We couldn't find any M3M projects matching your active category and corridor filters. Try clearing your filters to view all 34 developments.
            </p>
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <span>View All 34 Projects</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSites.map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Direct Concierge CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ContactCta
          title="Looking for Bespoke Payment Plans & Floor Layouts?"
          subtitle="Direct developer relationship desk offering confidential inventory allotments, pre-launch investor privileges, and private site visits."
        />
      </div>
    </div>
  );
};
