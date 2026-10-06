import React from 'react';
import { Phone, MessageCircle, MapPin, Mail, Clock, Crown } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.js';
import { getWhatsAppUrl, getPhoneCallUrl } from '../utils/contact.js';
import { SEO } from '../components/common/SEO.js';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();

  const whatsappUrl = getWhatsAppUrl(
    settings.whatsapp_number,
    'Hello, I would like to get more information about M3M Properties (Residential, Retail, Office, Serviced Suites).'
  );
  const callUrl = getPhoneCallUrl(settings.phone_number);

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact M3M Properties Concierge',
    telephone: settings.phone_number,
    url: typeof window !== 'undefined' ? window.location.href : '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.company_address || 'M3M Experion Center, Golf Course Extension Road, Sector 65',
      addressLocality: 'Gurugram',
      addressRegion: 'Haryana',
      postalCode: '122018',
      addressCountry: 'IN',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title="Contact M3M Properties Concierge & Sales Gallery"
        description="Get in touch with our private concierge for exclusive M3M residential brochures, retail floor plans, and VIP Experion Center appointments."
        canonicalPath="/contact"
        schemaData={contactSchema}
      />

      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
          <Phone className="w-3.5 h-3.5 text-amber-600" />
          <span>Private Client Concierge</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Connect Directly With M3M
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          We provide a seamless, direct developer relationship with zero intermediate friction. Reach out directly through WhatsApp or a telephone call to schedule private walkthroughs, view blueprints, and discuss custom payment milestones.
        </p>
      </div>

      {/* Main Contact Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* WhatsApp Card */}
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 shadow-sm flex flex-col justify-between space-y-6 hover:border-emerald-400 hover:shadow-xl transition-all">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <MessageCircle className="w-6 h-6 fill-current" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">WhatsApp Concierge</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instant messaging for high-resolution floor plans, project elevation renderings, pricing schedules, and live video tours.
            </p>
            <div className="text-sm font-bold text-emerald-700">
              {settings.whatsapp_number}
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xs transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Open WhatsApp Concierge</span>
          </a>
        </div>

        {/* Direct Phone Call Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between space-y-6 hover:border-amber-400 hover:shadow-xl transition-all">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Phone className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Telephone Hotline</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Speak directly with our senior luxury property advisors regarding unit availability, commercial yields, and priority allotments.
            </p>
            <div className="text-sm font-bold text-slate-900">
              {settings.phone_number}
            </div>
          </div>

          <a
            href={callUrl}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-sm shadow-xs transition-all active:scale-95"
          >
            <Phone className="w-4 h-4" />
            <span>Call Now</span>
          </a>
        </div>

        {/* Experion Center Location Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">M3M Experion Center</h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {settings.company_address}
            </p>
            {settings.email && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{settings.email}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{settings.business_hours || 'Mon - Sun: 9:00 AM - 8:00 PM'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/60 flex items-center gap-2 text-xs text-amber-900 font-semibold">
            <Crown className="w-4 h-4 text-amber-600 shrink-0" />
            <span>VIP experiential lounge visits welcome daily</span>
          </div>
        </div>
      </div>

      {/* Google Maps Location Section */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">M3M Experion Center & Corporate Gallery</h2>
            <p className="text-xs text-slate-500 mt-0.5">{settings.company_address}</p>
          </div>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(settings.company_address || 'Sector 65 Gurugram Haryana')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800"
          >
            <span>Open in Maps App</span>
          </a>
        </div>

        <div className="w-full h-88 bg-slate-100 relative">
          <iframe
            title="M3M Experion Center Map"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.company_address || 'Sector 65 Gurugram Haryana')}&hl=en&z=14&output=embed`}
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};
