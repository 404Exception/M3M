import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, MessageCircle, ArrowRight, ShieldCheck, Building2, Layers, Crown } from 'lucide-react';
import { Site } from '../types.js';
import { useSettings } from '../context/SettingsContext.js';
import { getWhatsAppUrl, generateSiteWhatsAppMessage } from '../utils/contact.js';

interface SiteCardProps {
  site: Site;
}

export const SiteCard: React.FC<SiteCardProps> = ({ site }) => {
  const { settings } = useSettings();

  const coverImage =
    site.images?.find((img) => img.isCover)?.imageUrl ||
    site.images?.[0]?.imageUrl ||
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';

  const locationName = site.location?.name || '';
  const isAvailable = site.status === 'Available';

  const whatsappMessage = generateSiteWhatsAppMessage(site.name, locationName);
  const whatsappUrl = getWhatsAppUrl(settings.whatsapp_number, whatsappMessage);

  // Configuration summary e.g. "3 Configurations Available"
  const plotSizesCount = site.plotSizes?.length || 0;
  const configSummary =
    plotSizesCount > 0
      ? `${plotSizesCount} Configurations`
      : 'Bespoke Layouts';

  // Category Badge Colors
  const getCategoryBadgeColor = (type?: string) => {
    switch ((type || '').toLowerCase()) {
      case 'residential':
        return 'bg-amber-500 text-slate-950 font-bold border border-amber-400';
      case 'retail':
        return 'bg-amber-600/90 text-white font-bold border border-amber-500/40';
      case 'office':
        return 'bg-slate-800 text-amber-300 font-bold border border-amber-500/30';
      case 'serviced apartments':
        return 'bg-yellow-600/90 text-slate-950 font-bold border border-yellow-400';
      case 'leasing':
        return 'bg-emerald-700 text-amber-200 font-bold border border-emerald-500/50';
      default:
        return 'bg-slate-900 text-amber-400 font-bold border border-amber-500/30';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-2xl hover:border-amber-500/50 transition-all duration-300 flex flex-col group hover:-translate-y-1">
      {/* Cover Image & Badges */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-950">
        <img
          src={coverImage}
          alt={site.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-slate-950/40" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-xs tracking-wider shadow-md backdrop-blur-xs ${getCategoryBadgeColor(site.siteType)}`}>
            {site.siteType || 'M3M Project'}
          </span>
          <span
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider shadow-xs backdrop-blur-xs ${
              isAvailable
                ? 'bg-emerald-600 text-white border border-emerald-500/30'
                : site.status === 'Sold'
                ? 'bg-rose-700 text-white'
                : 'bg-slate-800 text-slate-200 border border-slate-700'
            }`}
          >
            {site.status}
          </span>
        </div>

        {/* Confidential / Price on Request Badge */}
        <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md border border-amber-500/30 text-amber-400 px-3 py-1 rounded-lg text-xs font-semibold shadow-lg flex items-center gap-1.5">
          <Crown className="w-3 h-3 text-amber-400" />
          <span>Brochure on Request</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Location text */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">{locationName || site.address.split(',')[0]}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif-luxury font-bold text-slate-900 text-xl group-hover:text-amber-600 transition-colors line-clamp-1">
            <Link to={`/sites/${site.slug}`}>{site.name}</Link>
          </h3>

          {/* Short description */}
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {site.description}
          </p>
        </div>

        {/* Configurations & Landmark Pill */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-semibold text-slate-700">
            <Layers className="w-4 h-4 text-amber-600" />
            {configSummary}
          </span>
          <span className="flex items-center gap-1 text-amber-800 font-semibold bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            100% RERA
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <Link
            to={`/sites/${site.slug}`}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-amber-50 hover:text-amber-900 text-slate-800 font-bold text-xs transition-colors text-center border border-transparent hover:border-amber-200"
          >
            <span>Explore Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all active:scale-95 text-center"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>Brochure</span>
          </a>
        </div>
      </div>
    </div>
  );
};
