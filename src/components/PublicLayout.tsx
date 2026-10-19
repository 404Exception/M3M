import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header.js';
import { Footer } from './Footer.js';
import { MessageCircle, Phone } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.js';
import { getWhatsAppUrl, getPhoneCallUrl } from '../utils/contact.js';

import { FloatingConcierge } from './FloatingConcierge.js';

export const PublicLayout: React.FC = () => {
  const { settings } = useSettings();
  const whatsappUrl = getWhatsAppUrl(
    settings.whatsapp_number,
    'Hello, I am interested in exploring M3M Inventory (Residential, Retail, Office, Serviced Suites). Please share details.'
  );
  const phoneUrl = getPhoneCallUrl(settings.phone_number);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf9] text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-amber-500 selection:text-slate-950 pb-16 sm:pb-0">
      {/* Header */}
      <Header />

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Floating Desktop VIP Concierge */}
      <div className="hidden sm:block">
        <FloatingConcierge />
      </div>

      {/* Footer */}
      <Footer />

      {/* Floating Sticky Mobile CTA Bar (Mobile-first requirement) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-amber-500/30 p-2.5 flex items-center gap-2 shadow-2xl">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm active:scale-95 transition-transform"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>WhatsApp VIP Desk</span>
        </a>

        <a
          href={phoneUrl}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-slate-900 text-amber-300 border border-amber-500/30 font-bold text-xs shadow-sm active:scale-95 transition-transform"
        >
          <Phone className="w-4 h-4 text-amber-400" />
          <span>Call Concierge</span>
        </a>
      </div>
    </div>
  );
};
