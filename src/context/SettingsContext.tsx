import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppSettings } from '../types.js';
import { api } from '../services/api.js';

interface SettingsContextType {
  settings: AppSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: AppSettings = {
  company_name: 'M3M Properties',
  whatsapp_number: (import.meta as any).env?.VITE_DEFAULT_WHATSAPP_NUMBER || '+91 99999 88888',
  phone_number: (import.meta as any).env?.VITE_DEFAULT_PHONE_NUMBER || '+91 99999 88888',
  company_address: 'M3M Experion Centre, Golf Course Extension Road, Sector 65, Gurugram, Haryana - 122018',
  email: 'concierge@m3mproperties.in',
  logo_url: '/logo/m3m-logo.png',
  business_hours: 'Mon - Sun: 9:30 AM - 8:00 PM (Private Viewings by Appointment)',
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: false,
  refreshSettings: async () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState<boolean>(true);

  const loadSettings = async () => {
    try {
      const data = await api.getPublicSettings();
      if (data) {
        setSettings(prev => ({
          ...prev,
          ...data,
          logo_url: (data.logo_url && data.logo_url.trim()) ? data.logo_url : prev.logo_url,
          company_name: (data.company_name && data.company_name.trim()) ? data.company_name : prev.company_name,
        }));
      }
    } catch (err) {
      console.warn('Could not load remote settings, using defaults', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: loadSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
