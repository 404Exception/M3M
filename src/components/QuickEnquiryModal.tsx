import React, { useState, useEffect } from 'react';
import { X, Crown, ShieldCheck, Send, CheckCircle2, Phone, MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.js';
import { getWhatsAppUrl } from '../utils/contact.js';

interface QuickEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectName?: string;
}

export const QuickEnquiryModal: React.FC<QuickEnquiryModalProps> = ({
  isOpen,
  onClose,
  defaultProjectName = '',
}) => {
  const { settings } = useSettings();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [project, setProject] = useState(defaultProjectName || 'M3M Altitude');
  const [category, setCategory] = useState('Residential');
  const [budget, setBudget] = useState('₹2 Cr - ₹5 Cr');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync default project name and reset submission state on open
  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      if (defaultProjectName) {
        setProject(defaultProjectName);
      }
    }
  }, [isOpen, defaultProjectName]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    const whatsappText = `*VIP Developer Enquiry – M3M Inventory*\n\n*Name:* ${fullName}\n*Phone:* ${phone}\n*Email:* ${email || 'Not provided'}\n*Project of Interest:* ${project}\n*Category:* ${category}\n*Budget:* ${budget}\n*Requirement:* ${message || 'Please send complete brochure, floor plans and pricing schedule.'}`;

    const whatsappUrl = getWhatsAppUrl(settings.whatsapp_number, whatsappText);

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 600);
  };

  const projectOptions = [
    'M3M Altitude (Sector 65)',
    'M3M The Cullinan (Sector 94 Noida)',
    'M3M Golfestate (Sector 65)',
    'M3M Jewel (Sector 25 MG Road)',
    'M3M International Financial Center - IFC (Sector 66)',
    'M3M Crown (Sector 111 Dwarka Expwy)',
    'M3M Capital & Mansion (Sector 113)',
    'M3M Golf Hills & Antalya Hills (Sector 79 SPR)',
    'M3M 57Suites (Sector 57)',
    'M3M 65th Avenue & Route65 (Sector 65)',
    'M3M Broadway & Prive73 (SPR)',
    'M3M Urbana Business Park (Sector 67)',
    'M3M High-Street Retail Leasing',
    'M3M Grade-A Corporate Office Leasing',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-xl bg-slate-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 z-30 p-2.5 rounded-full bg-slate-900/90 text-slate-300 hover:text-white hover:bg-amber-500 hover:text-slate-950 border border-slate-700 hover:border-amber-400 transition-all cursor-pointer shadow-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif-luxury text-2xl font-bold text-white">Enquiry Received</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Thank you for connecting with M3M Inventory. A Senior Investment Advisor has been allotted to your profile and will share confidential brochures and payment plans shortly.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition-all cursor-pointer shadow-md"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Crown className="w-3.5 h-3.5" />
                <span>Direct Developer Relationship Desk</span>
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white pr-10">
                Request VIP Investor Deck
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Receive confidential floor plans, payment schedules, and private site visit concierge.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Malhotra"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Phone Number (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Project of Interest
                </label>
                <select
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                >
                  {defaultProjectName && !projectOptions.includes(defaultProjectName) && (
                    <option value={defaultProjectName} className="bg-slate-900 text-white">
                      {defaultProjectName}
                    </option>
                  )}
                  {projectOptions.map((p) => (
                    <option key={p} value={p} className="bg-slate-900 text-white">
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Asset Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Residential">Residential Sky Villa / Luxury Floor</option>
                  <option value="Retail">High-Street Retail / Food Court</option>
                  <option value="Office">Grade-A Corporate Office Suite</option>
                  <option value="Serviced Apartments">Managed Serviced Suite</option>
                  <option value="Leasing">Institutional Commercial Lease</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Investment Budget
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                >
                  <option value="₹75 Lac - ₹1.50 Cr">₹75 Lac - ₹1.50 Cr</option>
                  <option value="₹1.50 Cr - ₹3.00 Cr">₹1.50 Cr - ₹3.00 Cr</option>
                  <option value="₹3.00 Cr - ₹7.00 Cr">₹3.00 Cr - ₹7.00 Cr</option>
                  <option value="₹7.00 Cr - ₹15.00 Cr+">₹7.00 Cr - ₹15.00 Cr+</option>
                  <option value="Corporate / Institutional Lease">Corporate / Institutional Lease</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Specific Preferences / Questions
              </label>
              <textarea
                rows={2}
                placeholder="Mention specific configuration (e.g. 4 BHK, golf view, retail anchor space)..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>100% Confidential • Direct Developer Allotment</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all active:scale-95 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit & Connect</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
