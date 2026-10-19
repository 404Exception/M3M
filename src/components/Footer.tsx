import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, MapPin, Mail, ShieldCheck, Lock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.js';
import { getWhatsAppUrl, getPhoneCallUrl } from '../utils/contact.js';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const whatsappUrl = getWhatsAppUrl(
    settings.whatsapp_number,
    'Hello, I would like more information on M3M Inventory.'
  );
  const phoneUrl = getPhoneCallUrl(settings.phone_number);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: About Platform */}
          <div className="space-y-4">
            <Link to="/" onClick={scrollToTop} className="flex items-center gap-3 group">
              <div className="h-12 px-3.5 py-1 rounded-xl bg-white shadow-lg shadow-black/40 border border-amber-400/40 group-hover:border-amber-400 transition-all flex items-center justify-center shrink-0">
                <img
                  src={settings.logo_url || '/logo/m3m-logo.png'}
                  alt={settings.company_name || 'M3M Properties'}
                  className="h-8 w-auto max-w-[120px] object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-serif text-lg font-bold text-white tracking-wider leading-tight group-hover:text-amber-400 transition-colors">
                  {settings.company_name || 'M3M PROPERTIES'}
                </span>
                <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-[0.2em]">
                  Luxury Real Estate NCR
                </span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
              Magnificence in Men, Materials & Money. Delivering world-class architectural landmarks across Residential, Retail, Office, and Serviced Suites in Gurugram & NCR.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-amber-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>100% RERA Registered Projects</span>
            </div>
          </div>

          {/* Col 2: Property Categories */}
          <div className="space-y-3">
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider">Asset Portfolios</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/portfolio?category=Residential" onClick={scrollToTop} className="hover:text-amber-400 transition-colors">
                  Ultra-Luxury Residences (15 Projects)
                </Link>
              </li>
              <li>
                <Link to="/portfolio?category=Retail" onClick={scrollToTop} className="hover:text-amber-400 transition-colors">
                  High-Street Retail (14 Projects)
                </Link>
              </li>
              <li>
                <Link to="/portfolio?category=Office" onClick={scrollToTop} className="hover:text-amber-400 transition-colors">
                  Grade-A Corporate Offices (4 Projects)
                </Link>
              </li>
              <li>
                <Link to="/portfolio?category=Serviced%20Apartments" onClick={scrollToTop} className="hover:text-amber-400 transition-colors">
                  Serviced Suites (M3M 57Suites)
                </Link>
              </li>
              <li>
                <Link to="/portfolio" onClick={scrollToTop} className="text-amber-400 hover:text-amber-300 transition-colors font-semibold">
                  Browse All Developments →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Prime Corridors */}
          <div className="space-y-3">
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider">Prime Corridors</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/corridors/golf-course-extension-road" onClick={scrollToTop} className="hover:text-amber-400 transition-colors">
                  Golf Course Extension Road (Sec 65-68)
                </Link>
              </li>
              <li>
                <Link to="/corridors/southern-peripheral-road" onClick={scrollToTop} className="hover:text-amber-400 transition-colors">
                  Southern Peripheral Road (Sec 71-74)
                </Link>
              </li>
              <li>
                <Link to="/corridors/dwarka-expressway-corridor" onClick={scrollToTop} className="hover:text-amber-400 transition-colors">
                  Dwarka Expressway Corridor
                </Link>
              </li>
              <li>
                <Link to="/corridors/mg-road-central-gurugram" onClick={scrollToTop} className="hover:text-amber-400 transition-colors">
                  MG Road & Cyber City Hub
                </Link>
              </li>
              <li>
                <Link to="/corridors" onClick={scrollToTop} className="text-amber-400 hover:text-amber-300 transition-colors font-semibold">
                  Explore All Corridors →
                </Link>
              </li>
              <li>
                <Link to="/admin/login" onClick={scrollToTop} className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors pt-2">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Executive Login</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Direct Concierge */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider">Private Concierge</h3>
            <p className="text-xs text-slate-400">
              Speak directly with our senior investment advisors and luxury relationship managers:
            </p>
            <div className="space-y-3 text-sm">
              <a href={phoneUrl} className="flex items-start gap-2.5 text-slate-300 hover:text-amber-400 transition-colors">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                <span>{settings.phone_number}</span>
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 text-slate-300 hover:text-amber-400 transition-colors">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <span>WhatsApp: {settings.whatsapp_number}</span>
              </a>
              <div className="flex items-start gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                <span className="text-xs leading-relaxed">{settings.company_address}</span>
              </div>
              {settings.email && (
                <div className="flex items-start gap-2.5 text-slate-300">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                  <span className="text-xs">{settings.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-14 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <p>© {new Date().getFullYear()} {settings.company_name || 'M3M Inventory'}. All rights reserved.</p>
            <span className="hidden sm:inline text-slate-700">•</span>
            <p className="text-[11px] text-slate-400" itemScope itemType="https://schema.org/Organization">
              Created by{' '}
              <a
                id="footer-created-by-aero-logic"
                href="https://www.valueone.ai/"
                target="_blank"
                rel="noopener noreferrer author"
                itemProp="url"
                data-developer="Aero Logic Technologies"
                data-developer-url="https://www.aerologictechnologies.com"
                className="text-amber-400 hover:text-amber-300 font-medium transition-colors underline-offset-2 hover:underline"
              >
                <span itemProp="name">ValueOne.Ai</span>
              </a>
              <link itemProp="sameAs" href="https://www.aerologictechnologies.com" />
              <link itemProp="parentOrganization" href="https://www.aerologictechnologies.com" />
            </p>
          </div>
          <p className="text-center sm:text-right text-slate-500">
            Ultra-Luxury Residences • High-Street Retail • Grade-A Offices • Serviced Suites
          </p>
        </div>
      </div>
    </footer>
  );
};
