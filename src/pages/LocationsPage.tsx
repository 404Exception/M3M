import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapPin, Search, Building, Layers, Store, Briefcase, Home as HomeIcon, Compass, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../services/api.js';
import { Location, Site } from '../types.js';
import { LocationCard } from '../components/LocationCard.js';
import { SiteCard } from '../components/SiteCard.js';
import { ContactCta } from '../components/ContactCta.js';
import { SEO } from '../components/common/SEO.js';

export const LocationsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';

  const [locations, setLocations] = useState<Location[]>([]);
  const [allSites, setAllSites] = useState<Site[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All');
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
        console.error('Failed to load locations and sites', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleCategorySelect = (catName: string) => {
    setSelectedCategory(catName);
    if (catName === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catName });
    }
  };

  const categories = [
    { name: 'All', icon: Layers, label: 'All Categories' },
    { name: 'Residential', icon: HomeIcon, label: 'Residential (15)' },
    { name: 'Retail', icon: Store, label: 'Retail (14)' },
    { name: 'Office', icon: Briefcase, label: 'Offices (4)' },
    { name: 'Serviced Apartments', icon: Building, label: 'Serviced Suites (1)' },
  ];

  // Filter sites based on selected category & search
  const filteredSites = allSites.filter((site) => {
    const matchesCat = selectedCategory === 'All' || (site.siteType || '').toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchTerm ||
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (site.location?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">
      <SEO
        title={selectedCategory === 'All' ? 'M3M Prime Corridors & Landmark Portfolios' : `M3M ${selectedCategory} Properties in Gurugram`}
        description="Explore iconic M3M residential, high-street retail, corporate office, and serviced suites developments across Golf Course Extn Rd, SPR, Dwarka Expressway, and MG Road."
        keywords="m3m properties, m3m residential, m3m retail, m3m offices, golf course extension road, spr gurugram, dwarka expressway"
        canonicalPath="/locations"
      />

      {/* 1. Header Hero Banner */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 border border-amber-200 px-3.5 py-1 rounded-full">
          <Compass className="w-3.5 h-3.5 text-amber-600" />
          <span>Prime NCR Corridors & Asset Portfolios</span>
        </div>
        <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
          Strategic Growth Corridors & Landmark Developments
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          Explore M3M’s 34 masterworks organized by premier arterial expressways and commercial belts across Gurugram & NCR. Select any corridor below to explore its specific developments.
        </p>
      </div>

      {/* 2. PRIME GROWTH CORRIDORS (Placed right on top!) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900">
              Gurugram's 5 Prime Arterial Corridors
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select a corridor to view all dedicated residential, retail, and corporate landmarks along that belt.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-4/3 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {filteredLocations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        )}
      </section>

      {/* 3. ASSET CLASS SEARCH & FILTERABLE PORTFOLIO */}
      <section id="portfolio-explorer" className="space-y-8 pt-6 border-t border-slate-200">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>Asset Explorer</span>
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900">
                Explore All 34 M3M Properties
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              Showing {filteredSites.length} of {allSites.length} Developments
            </span>
          </div>

          {/* Search & Category Tabs Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pt-2">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by project name, sector, or corridor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-xs"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 bg-slate-100 px-2 py-0.5 rounded cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
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
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                      isSelected
                        ? 'bg-slate-950 text-amber-400 border border-amber-500/40 shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span>{cat.name}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        ) : filteredSites.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
            <Building className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No Projects Found</h3>
            <p className="text-sm text-slate-500">
              No active projects match your search criteria. Try selecting "All Categories" or clearing the search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSites.map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Direct Developer CTA */}
      <ContactCta
        title="Looking for an Upcoming M3M Launch?"
        subtitle="New luxury residences and retail landmarks are regularly unveiled across prime corridors. Connect with our concierge for pre-launch investor privileges and priority allocations."
      />
    </div>
  );
};
