import React, { useState } from 'react';
import { MessageCircle, Phone, X, ChevronUp, Crown } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.js';
import { getWhatsAppUrl, getPhoneCallUrl } from '../utils/contact.js';
import { QuickEnquiryModal } from './QuickEnquiryModal.js';

export const FloatingConcierge: React.FC = () => {
  const { settings } = useSettings();
  const [modalOpen, setModalOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const whatsappUrl = getWhatsAppUrl(
    settings.whatsapp_number,
    'Hello, I am interested in exploring M3M Inventory. Please connect me with a luxury property advisor.'
  );
  const phoneUrl = getPhoneCallUrl(settings.phone_number);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {expanded && (
          <div className="flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <button
              onClick={() => {
                setModalOpen(true);
                setExpanded(false);
              }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-950 text-amber-300 border border-amber-500/40 shadow-xl text-xs font-bold hover:bg-slate-900 transition-all cursor-pointer backdrop-blur-md"
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span>VIP Investor Deck</span>
            </button>

            <a
              href={phoneUrl}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-950 text-slate-200 border border-slate-700 shadow-xl text-xs font-semibold hover:text-amber-400 transition-all cursor-pointer backdrop-blur-md"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Direct Phone Call</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-emerald-600 text-white shadow-xl text-xs font-bold hover:bg-emerald-500 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        )}

        {/* Floating Toggle Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-black text-xs shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all border border-amber-300/40 cursor-pointer"
          aria-label="Toggle VIP Concierge"
        >
          {expanded ? (
            <X className="w-5 h-5 text-slate-950" />
          ) : (
            <>
              <MessageCircle className="w-4 h-4 fill-current text-slate-950" />
              <span className="tracking-wide uppercase text-[11px]">VIP Concierge</span>
            </>
          )}
        </button>
      </div>

      <QuickEnquiryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
