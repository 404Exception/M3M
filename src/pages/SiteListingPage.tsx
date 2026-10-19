import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Building, Layers } from 'lucide-react';
import { api } from '../services/api.js';
import { Location, Site } from '../types.js';
import { SiteCard } from '../components/SiteCard.js';
import { ContactCta } from '../components/ContactCta.js';
import { SEO } from '../components/common/SEO.js';

export const SiteListingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLocationSites() {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const data = await api.getLocationSites(slug);
        setLocation(data.location);
        setSites(data.sites);
      } catch (err: any) {
        setError(err.message || 'Failed to load projects for this corridor');
      } finally {
        setLoading(false);
      }
    }
    loadLocationSites();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 animate-pulse">
        <div className="h-6 w-32 bg-slate-200 rounded-md" />
        <div className="h-12 w-80 bg-slate-200 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <SEO title="Corridor Not Found" description="The requested corridor could not be found." />
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <MapPin className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Corridor Not Found</h1>
        <p className="text-slate-600">
          The requested location could not be located or does not have any active M3M projects.
        </p>
        <Link
          to="/corridors"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Prime Corridors</span>
        </Link>
      </div>
    );
  }

  // Filter sites by category if chosen
  const filteredSites = selectedCategory === 'All'
    ? sites
    : sites.filter(s => (s.siteType || '').toLowerCase() === selectedCategory.toLowerCase());

  const categories = ['All', 'Residential', 'Retail', 'Office', 'Serviced Apartments'];

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `M3M Inventory in ${location.name}, ${location.city}`,
    description: `Iconic M3M luxury residences, retail avenues, and Grade-A offices in ${location.name}.`,
    itemListElement: sites.map((s, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: s.name,
      url: `/sites/${s.slug}`,
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      <SEO
        title={`M3M Projects in ${location.name}, ${location.city}`}
        description={`Explore iconic M3M luxury residential, high-street retail, and corporate office developments in ${location.name}, ${location.city}. Ready brochures, prices, and floor plans.`}
        canonicalPath={`/corridors/${location.slug}`}
        schemaData={itemListSchema}
      />

      {/* Breadcrumb / Back Link */}
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Link to="/corridors" className="hover:text-amber-600 flex items-center gap-1 font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Prime Corridors</span>
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-900">{location.name}</span>
      </div>

      {/* Hero / Header info for the selected location */}
      <div className="bg-slate-950 rounded-3xl border border-amber-500/20 p-8 sm:p-12 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 text-white relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>{location.city}, {location.state} • Prime Arterial Corridor</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            M3M Developments along {location.name}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Discover iconic high-rise residential condominiums, signature retail boulevards, and Grade-A corporate towers by M3M across {location.name}.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <div className="px-5 py-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 text-center">
            <span className="block text-2xl font-black text-amber-400">{sites.length}</span>
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Iconic Landmarks</span>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => {
          const count = cat === 'All'
            ? sites.length
            : sites.filter(s => (s.siteType || '').toLowerCase() === cat.toLowerCase()).length;

          if (cat !== 'All' && count === 0) return null;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-950 text-amber-400 shadow-md border border-amber-500/40'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{cat}</span>
              <span className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] ${selectedCategory === cat ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sites Grid */}
      {filteredSites.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <Building className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Projects Found in this Category</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Try switching to 'All' or another category to view active M3M developments in {location.name}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      )}

      {/* Bottom CTA with location context */}
      <ContactCta
        title={`Looking for specific configurations in ${location.name}?`}
        subtitle={`Speak directly with our dedicated ${location.name} relationship concierge for unit layouts, pricing, and private site walkthroughs.`}
        locationName={location.name}
      />
    </div>
  );
};
