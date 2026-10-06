import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { Location } from '../types.js';

interface LocationCardProps {
  location: Location;
}

export const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
  const imageUrl =
    location.imageUrl ||
    'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=800&q=80';

  const siteCount = location.siteCount ?? 0;

  return (
    <Link
      to={`/corridors/${location.slug}`}
      className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-800/80 block bg-slate-950 aspect-4/3 flex flex-col justify-end p-6 hover:-translate-y-1"
    >
      {/* Background Image */}
      <img
        src={imageUrl}
        alt={location.name}
        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-85"
        loading="lazy"
      />

      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

      {/* Badges on top */}
      <div className="absolute top-4 right-4 z-10">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-950/90 text-amber-400 border border-amber-500/40 backdrop-blur-md shadow-md">
          {siteCount} {siteCount === 1 ? 'Landmark' : 'Landmarks'}
        </span>
      </div>

      {/* Content at bottom */}
      <div className="relative z-10 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>{location.city}, {location.state}</span>
        </div>

        <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
          {location.name}
        </h3>

        <div className="pt-2 flex items-center gap-2 text-xs font-bold text-amber-400 group-hover:text-amber-300 group-hover:translate-x-1 transition-all">
          <span>Explore Corridor Landmarks</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
};
