import React, { useEffect, useState } from 'react';
import { Crown, Building, Layers, CheckCircle2, Phone, MessageCircle, MapPin, HelpCircle, Award, ShieldCheck } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.js';
import { ContactCta } from '../components/ContactCta.js';
import { api } from '../services/api.js';
import { Location } from '../types.js';
import { SEO } from '../components/common/SEO.js';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const { settings } = useSettings();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAboutData() {
      try {
        const locs = await api.getLocations();
        setLocations(locs);
      } catch (err) {
        console.error('Failed to load corridors in about page', err);
      } finally {
        setLoading(false);
      }
    }
    loadAboutData();
  }, []);

  // Parse dynamic features from settings if available
  let featuresList = [
    {
      title: 'World-Class Global Architects',
      desc: 'Collaborations with internationally renowned architectural consultancies including Chapman Taylor (UK), RSP (Singapore), and ARCOP.',
    },
    {
      title: 'Unmatched Prime Corridors',
      desc: 'Strategic landmark developments across Golf Course Extension Road, SPR, Dwarka Expressway, and MG Road.',
    },
    {
      title: 'Speed & Timely Delivery Track Record',
      desc: 'Proven execution speed with over 30 Million square feet delivered to date across NCR.',
    },
    {
      title: '100% Legal & RERA Compliant',
      desc: 'Complete regulatory transparency with approved blueprints, clear titles, and top tier nationalized & private banking partners.',
    },
  ];

  if (settings.about_features) {
    try {
      const parsed = JSON.parse(settings.about_features);
      if (Array.isArray(parsed) && parsed.length > 0) {
        featuresList = parsed;
      }
    } catch {
      // Fallback used
    }
  }

  // Parse FAQs from settings if available
  let faqList = [
    {
      question: 'What property categories are developed by M3M Properties?',
      answer:
        'M3M Properties develops four core asset classes in NCR: Ultra-Luxury Residential Condominiums (Altitude, Golf Hills, Antalya Hills, OPUS, Golfestate), High-Street Retail & Commercial (Jewel, Urbana, Broadway, 65th Avenue), Grade-A Corporate Office Towers (M3M IFC, CFC, Jewel Offices), and Managed Serviced Apartments (M3M 57Suites).',
    },
    {
      question: 'Where are M3M projects located in Gurugram?',
      answer:
        'M3M projects are located on the most high-growth infrastructure corridors in Gurugram: Golf Course Extension Road (Sectors 65, 66, 67, 68), Southern Peripheral Road (Sectors 71, 73, 74), Dwarka Expressway (Sectors 84, 89, 107), and Central MG Road (Sector 25).',
    },
    {
      question: 'Are all M3M properties RERA registered and bank approved?',
      answer:
        'Yes, all M3M residential, retail, office, and serviced suite developments are 100% registered with the Haryana Real Estate Regulatory Authority (HARERA) and approved by major financial institutions including HDFC Bank, ICICI Bank, and State Bank of India.',
    },
    {
      question: 'How do I schedule a private visit to an M3M Experion Center?',
      answer:
        'You can connect directly with our private concierge via WhatsApp or phone call to schedule a tailored VIP walkthrough of project model galleries, sample sky mansions, and on-site locations.',
    },
  ];

  if (settings.faqs) {
    try {
      const parsed = JSON.parse(settings.faqs);
      if (Array.isArray(parsed) && parsed.length > 0) {
        faqList = parsed;
      }
    } catch {
      // Fallback used
    }
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqList.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      <SEO
        title="About M3M Properties – Vision, Leadership & Luxury Portfolio"
        description="Discover M3M India – Magnificence in Men, Materials & Money. Learn about our architectural legacy, 30M+ sq.ft delivered track record, and prime NCR corridors."
        canonicalPath="/about"
        schemaData={faqSchema}
      />

      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
          <Crown className="w-3.5 h-3.5 text-amber-600" />
          <span>The M3M Heritage</span>
        </div>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
          {settings.about_title || 'Pioneering Luxury & Redefining NCR’s Architectural Skyline'}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          {settings.about_description ||
            'M3M India stands for "Magnificence in the Trinity of Men, Materials & Money". Over the past two decades, M3M has emerged as one of India’s fastest growing luxury real estate developers, transforming Gurugram into a world-class global metropolis.'}
        </p>
      </div>

      {/* Mission / Context */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white p-8 sm:p-14 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Our Architectural Vision</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {settings.about_mission ||
              'Our vision is to craft architectural masterworks that merge cutting-edge global design, sustainable construction, unmatched lifestyle amenities, and exceptional investment value for discerning homeowners and corporate enterprises.'}
          </p>

          <div className="space-y-4 pt-2">
            {featuresList.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3.5">
                <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm font-bold text-slate-900">{item.title}:</span>{' '}
                  <span className="text-sm text-slate-600 leading-relaxed">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-100">
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
            alt="M3M Luxury Living Experience"
            loading="lazy"
            className="w-full h-96 object-cover"
          />
        </div>
      </div>

      {/* Four Asset Verticals */}
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Asset Classes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Four Core Pillars of Development
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Comprehensive real estate mastery tailored for luxury homeowners, global brands, and multinational enterprises:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">Residential</span>
            <h3 className="font-extrabold text-slate-900 text-lg">Ultra-Luxury Residences</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              15 iconic residential landmarks featuring golf-front suites, private sky mansions, and Olympic infinity pools (Altitude, Golf Hills, Antalya Hills, OPUS).
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">Retail</span>
            <h3 className="font-extrabold text-slate-900 text-lg">High-Street Retail</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              14 premier retail promenades and shopping boulevards with double-height glass storefronts and entertainment zones (Jewel, Urbana, Broadway, 65th Avenue).
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">Office</span>
            <h3 className="font-extrabold text-slate-900 text-lg">Grade-A Corporate Towers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Iconic headquarters towers offering LEED-certified efficiency, high-speed capsule lifts, and Fortune 500 corporate hubs (M3M IFC, Jewel Offices, CFC).
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">Hospitality</span>
            <h3 className="font-extrabold text-slate-900 text-lg">Managed Serviced Suites</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bespoke 1 & 2 BHK five-star managed serviced suites designed for steady passive rental yield and high-profile executive stays (M3M 57Suites).
            </p>
          </div>
        </div>
      </div>

      {/* Coverage Corridors */}
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>Strategic Footprint</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Prime Corridors in Gurugram & NCR
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our active developments span the most prestigious growth belts in Northern India:
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        ) : locations.length === 0 ? (
          <p className="text-slate-500 text-sm">No corridors listed yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((loc) => (
              <Link
                key={loc.id}
                to={`/locations/${loc.slug}`}
                className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-500 hover:shadow-lg transition-all space-y-2 block"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-amber-600 transition-colors">
                    {loc.name}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold">
                    {loc.city}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {`Explore M3M luxury residential, retail, and office landmarks in ${loc.name}.`}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 sm:p-14 space-y-8">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Buyer & Investor Guidance</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions (FAQs)
          </h2>
          <p className="text-sm text-slate-600">
            Answers to common questions regarding M3M property investments, RERA credentials, and booking processes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqList.map((item, idx) => (
            <div key={idx} className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <h3 className="font-bold text-slate-900 text-base flex items-start gap-2">
                <span className="text-amber-600 font-extrabold">Q.</span>
                <span>{item.question}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-5">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <ContactCta />
    </div>
  );
};
