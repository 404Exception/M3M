const defaultWhatsApp = (import.meta as any).env?.VITE_DEFAULT_WHATSAPP_NUMBER || '';
const defaultPhone = (import.meta as any).env?.VITE_DEFAULT_PHONE_NUMBER || '';

export function getWhatsAppUrl(
  phoneNumber?: string,
  message?: string
): string {
  // Clean phone number: remove spaces, +, -, etc.
  const raw = phoneNumber || defaultWhatsApp || '';
  const cleanPhone = raw.replace(/\D/g, '');
  const encodedMsg = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${cleanPhone}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
}

export function getPhoneCallUrl(phoneNumber?: string): string {
  const raw = phoneNumber || defaultPhone || '';
  const clean = raw.replace(/\s+/g, '');
  return `tel:${clean}`;
}

export function generateSiteWhatsAppMessage(siteName: string, locationName?: string): string {
  if (locationName) {
    return `Hello, I am interested in ${siteName} in ${locationName}. Please share more details.`;
  }
  return `Hello, I am interested in ${siteName}. Please share more details.`;
}

export function generatePlotSizeWhatsAppMessage(
  plotSize: string,
  area: string,
  siteName: string,
  locationName?: string
): string {
  if (locationName) {
    return `Hello, I am interested in the ${plotSize} (${area}) configuration at ${siteName}, ${locationName}. Please share brochure, payment plan, and availability details.`;
  }
  return `Hello, I am interested in the ${plotSize} (${area}) configuration at ${siteName}. Please share brochure, payment plan, and availability details.`;
}
