import React from 'react';
import { MessageCircle, Phone, Crown, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.js';
import { getWhatsAppUrl, getPhoneCallUrl } from '../utils/contact.js';

interface ContactCtaProps {
  title?: string;
  subtitle?: string;
  siteName?: string;
  locationName?: string;
}

export const ContactCta: React.FC<ContactCtaProps> = ({
  title = "Experience M3M Grandeur – Schedule a Private Tour",
  subtitle = "Connect directly with our luxury relationship concierge for exclusive pricing, floor plans, and VIP site walkthroughs.",
  siteName,
  locationName,
}) => {
  const { settings } = useSettings();

  const msg = siteName
    ? `Hello, I am interested in ${siteName}${locationName ? ` in ${locationName}` : ''}. Please share brochure and private visit details.`
    : 'Hello, I am interested in exploring M3M Inventory (Residential, Retail, Office, Serviced Suites). Please connect with me.';

  const whatsappUrl = getWhatsAppUrl(settings.whatsapp_number, msg);
  const phoneUrl = getPhoneCallUrl(settings.phone_number);

  return (
    <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-14 shadow-2xl border border-amber-500/30 relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider border border-amber-500/30">
          <Crown className="w-3.5 h-3.5" />
          <span>M3M Private Concierge • Direct Developer Desk</span>
        </div>

        <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
          {title}
        </h2>

        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        {/* Feature bullets */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-xs sm:text-sm text-slate-300 pt-2 pb-2">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            Direct Developer Booking
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            100% RERA Registered
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            Bespoke Payment Plans
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Connect on WhatsApp</span>
          </a>

          <a
            href={phoneUrl}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm sm:text-base shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <Phone className="w-5 h-5 text-slate-950" />
            <span>Call Concierge: {settings.phone_number}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
