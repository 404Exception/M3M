import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Phone,
  MessageCircle,
  Menu,
  X,
  Building2,
  MapPin,
  Building,
  ChevronDown,
  Crown,
  Compass,
  Store,
  Briefcase,
  Home as HomeIcon,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext.js';
import { getWhatsAppUrl, getPhoneCallUrl } from '../utils/contact.js';

export const Header: React.FC = () => {
  const { settings } = useSettings();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [corridorsDropdownOpen, setCorridorsDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    setCorridorsDropdownOpen(false);
    setCategoriesDropdownOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' && !location.search;
    return location.pathname.startsWith(path);
  };

  const primeCorridors = [
    {
      name: 'Golf Course Extension Road',
      slug: 'golf-course-extension-road',
      sectors: 'Sector 65, 66, 67, 68',
      highlights: 'Altitude, IFC Twin Towers, Urbana, 65th Avenue',
    },
    {
      name: 'Southern Peripheral Road (SPR)',
      slug: 'southern-peripheral-road',
      sectors: 'Sector 71, 72, 73, 74',
      highlights: 'Golf Hills, Antalya Hills, Broadway, Prive73',
    },
    {
      name: 'Dwarka Expressway Corridor',
      slug: 'dwarka-expressway-corridor',
      sectors: 'Sector 111, 113, 84',
      highlights: 'M3M Crown, M3M Capital, 84Market',
    },
    {
      name: 'MG Road & Cyber City Hub',
      slug: 'mg-road-central-gurugram',
      sectors: 'Sector 25, 57',
      highlights: 'M3M Jewel, Paragon57, 57Suites, Atrium57',
    },
    {
      name: 'New Gurugram & Sector 84/89',
      slug: 'new-gurugram-sector-84-89',
      sectors: 'Sector 89, 79',
      highlights: 'M3M Soulitude, Woodshire, Golfestate',
    },
  ];

  const categories = [
    {
      name: 'Ultra-Luxury Residences',
      slug: 'Residential',
      count: '15 Landmarks',
      icon: HomeIcon,
      desc: 'Altitude, Golf Hills, Antalya Hills, OPUS, Fairway West',
    },
    {
      name: 'High-Street Retail',
      slug: 'Retail',
      count: '14 Promenades',
      icon: Store,
      desc: 'Jewel, Urbana, Broadway, 65th Avenue, Paragon57',
    },
    {
      name: 'Grade-A Corporate Offices',
      slug: 'Office',
      count: '4 Flagships',
      icon: Briefcase,
      desc: 'M3M Jewel Offices, Tee Point, CFC, IFC Towers',
    },
    {
      name: 'Managed Serviced Suites',
      slug: 'Serviced Apartments',
      count: 'M3M 57Suites',
      icon: Building,
      desc: 'Five-star managed serviced suites in Sector 57',
    },
  ];

  const whatsappLink = getWhatsAppUrl(
    settings.whatsapp_number,
    'Hello, I am interested in exploring M3M Properties (Residential, Retail, Office, Serviced Suites). Please connect with me.'
  );
  const callLink = getPhoneCallUrl(settings.phone_number);

  return (
    <header className="sticky top-0 z-40 bg-[#080c14]/95 backdrop-blur-md border-b border-[#d4af37]/25 text-white shadow-xl">
      {/* Top micro bar for Trust & Concierge Badge */}
      <div className="bg-[#05080e] text-slate-300 text-xs py-2 px-4 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 text-[11px] uppercase tracking-wider">
              <Crown className="w-3 h-3 text-amber-400" />
              M3M Official Developer Portfolio
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline text-slate-400 text-[11px] tracking-wide">Magnificence in Men, Materials & Money</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 text-[11px]">
            <span className="hidden md:flex items-center gap-1 text-slate-400">
              <MapPin className="w-3 h-3 text-amber-400" />
              Golf Course Extn • SPR • Dwarka Exp • MG Road
            </span>
            <Link to="/admin/login" onClick={handleLinkClick} className="text-amber-400/80 hover:text-amber-300 transition-colors underline-offset-2 hover:underline font-semibold">
              Executive Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" onClick={handleLinkClick} className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-slate-950 font-black text-xl shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform overflow-hidden border border-amber-400/30">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.company_name || 'M3M Properties'} className="w-full h-full object-cover" />
              ) : (
                <span className="tracking-tighter font-extrabold text-slate-950">M3M</span>
              )}
            </div>
            <div>
              <span className="block font-serif-luxury font-bold text-xl sm:text-2xl text-white tracking-wide leading-tight">
                {settings.company_name || 'M3M Properties'}
              </span>
              <span className="block text-[10px] font-semibold text-amber-400 uppercase tracking-[0.2em]">
                Luxury Real Estate Developer
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              to="/"
              onClick={handleLinkClick}
              className={`text-sm font-semibold transition-colors py-1 ${
                isActive('/')
                  ? 'text-amber-400 border-b-2 border-amber-400'
                  : 'text-slate-300 hover:text-amber-400'
              }`}
            >
              Home
            </Link>

            {/* PRIME CORRIDORS MENU (Direct link to /corridors + Dropdown) */}
            <div
              className="relative group py-2"
              onMouseEnter={() => {
                setCorridorsDropdownOpen(true);
                setCategoriesDropdownOpen(false);
              }}
              onMouseLeave={() => setCorridorsDropdownOpen(false)}
            >
              <Link
                to="/corridors"
                onClick={handleLinkClick}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors py-1 cursor-pointer focus:outline-hidden ${
                  location.pathname.startsWith('/corridors') || location.pathname.startsWith('/locations')
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-slate-300 hover:text-amber-400'
                }`}
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Prime Corridors</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${corridorsDropdownOpen ? 'rotate-180' : ''}`} />
              </Link>

              {corridorsDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[480px] bg-slate-950/98 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4 shadow-2xl space-y-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 px-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5" />
                      Gurugram Arterial Belts
                    </span>
                    <Link
                      to="/corridors"
                      onClick={handleLinkClick}
                      className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20"
                    >
                      <span>Explore All 5 Corridors</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="space-y-1.5">
                    {primeCorridors.map((corridor) => (
                      <Link
                        key={corridor.slug}
                        to={`/corridors/${corridor.slug}`}
                        onClick={handleLinkClick}
                        className="block p-3 rounded-xl hover:bg-slate-900/90 border border-transparent hover:border-amber-500/30 transition-all group/item"
                      >
                        <div className="flex items-center justify-between">
                          <strong className="text-sm font-bold text-white group-hover/item:text-amber-400 transition-colors">
                            {corridor.name}
                          </strong>
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                            {corridor.sectors}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-1 font-normal">
                          {corridor.highlights}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ASSET PORTFOLIOS MENU (Direct link to /portfolio + Dropdown) */}
            <div
              className="relative group py-2"
              onMouseEnter={() => {
                setCategoriesDropdownOpen(true);
                setCorridorsDropdownOpen(false);
              }}
              onMouseLeave={() => setCategoriesDropdownOpen(false)}
            >
              <Link
                to="/portfolio"
                onClick={handleLinkClick}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors py-1 cursor-pointer focus:outline-hidden ${
                  location.pathname.startsWith('/portfolio') || location.pathname.startsWith('/projects') || location.pathname.startsWith('/sites')
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-slate-300 hover:text-amber-400'
                }`}
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Portfolios</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${categoriesDropdownOpen ? 'rotate-180' : ''}`} />
              </Link>

              {categoriesDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[440px] bg-slate-950/98 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4 shadow-2xl space-y-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 px-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      Asset Class Spectrum
                    </span>
                    <Link
                      to="/portfolio"
                      onClick={handleLinkClick}
                      className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20"
                    >
                      <span>All 34 Masterpieces</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="space-y-1.5">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <Link
                          key={cat.slug}
                          to={`/portfolio?category=${encodeURIComponent(cat.slug)}`}
                          onClick={handleLinkClick}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-900/90 border border-transparent hover:border-amber-500/30 transition-all group/item"
                        >
                          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20 group-hover/item:scale-110 transition-transform mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <strong className="text-sm font-bold text-white group-hover/item:text-amber-400 transition-colors">
                                {cat.name}
                              </strong>
                              <span className="text-[10px] font-bold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-md">
                                {cat.count}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                              {cat.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/about"
              onClick={handleLinkClick}
              className={`text-sm font-semibold transition-colors py-1 ${
                isActive('/about')
                  ? 'text-amber-400 border-b-2 border-amber-400'
                  : 'text-slate-300 hover:text-amber-400'
              }`}
            >
              About M3M
            </Link>

            <Link
              to="/blogs"
              onClick={handleLinkClick}
              className={`text-sm font-semibold transition-colors py-1 ${
                isActive('/blogs')
                  ? 'text-amber-400 border-b-2 border-amber-400'
                  : 'text-slate-300 hover:text-amber-400'
              }`}
            >
              Market Intelligence
            </Link>

            <Link
              to="/contact"
              onClick={handleLinkClick}
              className={`text-sm font-semibold transition-colors py-1 ${
                isActive('/contact')
                  ? 'text-amber-400 border-b-2 border-amber-400'
                  : 'text-slate-300 hover:text-amber-400'
              }`}
            >
              VIP Concierge
            </Link>
          </nav>

          {/* Desktop Direct Contact CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm hover:shadow-emerald-600/30 transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </a>
            <a
              href={callLink}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm hover:shadow-amber-500/30 transition-all active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>Concierge</span>
            </a>
          </div>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 lg:hidden focus:outline-hidden cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
          <nav className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={handleLinkClick}
              className={`px-3 py-2.5 rounded-xl text-base font-semibold ${
                isActive('/') ? 'bg-amber-500/10 text-amber-400' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              Home
            </Link>

            {/* Mobile Prime Corridors */}
            <div className="pt-3 pb-1 px-3 flex items-center justify-between">
              <Link
                to="/corridors"
                onClick={handleLinkClick}
                className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                Prime Corridors
              </Link>
              <Link to="/corridors" onClick={handleLinkClick} className="text-[11px] text-amber-400 font-semibold underline">
                View All Corridors
              </Link>
            </div>
            <div className="space-y-1 px-1">
              {primeCorridors.map((corridor) => (
                <Link
                  key={corridor.slug}
                  to={`/corridors/${corridor.slug}`}
                  onClick={handleLinkClick}
                  className="p-2.5 rounded-lg bg-slate-900 text-xs font-medium text-slate-200 hover:text-amber-400 border border-slate-800 flex items-center justify-between"
                >
                  <span className="font-semibold text-white">{corridor.name}</span>
                  <span className="text-[10px] text-slate-400">{corridor.sectors.split(',')[0]}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Asset Portfolios */}
            <div className="pt-3 pb-1 px-3 flex items-center justify-between">
              <Link
                to="/portfolio"
                onClick={handleLinkClick}
                className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                Asset Portfolios
              </Link>
              <Link to="/portfolio" onClick={handleLinkClick} className="text-[11px] text-amber-400 font-semibold underline">
                All 34 Projects
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 px-1">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/portfolio?category=${encodeURIComponent(cat.slug)}`}
                  onClick={handleLinkClick}
                  className="p-2.5 rounded-lg bg-slate-900 text-xs font-medium text-slate-200 hover:text-amber-400 border border-slate-800 flex flex-col justify-between"
                >
                  <span className="font-bold text-white">{cat.name}</span>
                  <span className="text-[10px] text-amber-400/80 font-semibold">{cat.count}</span>
                </Link>
              ))}
            </div>

            <div className="pt-3" />
            <Link
              to="/about"
              onClick={handleLinkClick}
              className={`px-3 py-2.5 rounded-xl text-base font-semibold ${
                isActive('/about') ? 'bg-amber-500/10 text-amber-400' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              About M3M
            </Link>

            <Link
              to="/blogs"
              onClick={handleLinkClick}
              className={`px-3 py-2.5 rounded-xl text-base font-semibold ${
                isActive('/blogs') ? 'bg-amber-500/10 text-amber-400' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              Market Intelligence
            </Link>

            <Link
              to="/contact"
              onClick={handleLinkClick}
              className={`px-3 py-2.5 rounded-xl text-base font-semibold ${
                isActive('/contact') ? 'bg-amber-500/10 text-amber-400' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              VIP Concierge
            </Link>
          </nav>

          <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs text-center shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </a>
            <a
              href={callLink}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs text-center shadow-xs"
            >
              <Phone className="w-4 h-4" />
              <span>Call Concierge</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
