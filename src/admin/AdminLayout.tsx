import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  PlusCircle,
  MapPin,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  Building2,
  Menu,
  X,
  ShieldAlert,
  BookOpen
} from 'lucide-react';
import { getAuthToken, clearAuthToken, getStoredUser } from '../services/api.js';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = getStoredUser();

  useEffect(() => {
    const token = getAuthToken();
    if (!token && location.pathname !== '/admin/login') {
      navigate('/admin/login');
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    clearAuthToken();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Projects & Portfolios', path: '/admin/sites', icon: Layers },
    { name: 'Add Project', path: '/admin/sites/new', icon: PlusCircle },
    { name: 'Corridors / Locations', path: '/admin/locations', icon: MapPin },
    { name: 'Market Intelligence', path: '/admin/blogs', icon: BookOpen },
    { name: 'System Settings', path: '/admin/settings', icon: SettingsIcon },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-950 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="h-8 px-2 py-0.5 rounded-lg bg-white border border-amber-400/40 flex items-center justify-center shrink-0">
            <img src="/logo/m3m-logo.png" alt="M3M" className="h-5 w-auto object-contain" />
          </div>
          <span className="font-bold text-sm">M3M Executive</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:flex flex-col w-full md:w-64 bg-slate-950 text-slate-300 shrink-0 min-h-screen md:sticky md:top-0 border-r border-slate-850 z-30`}
      >
        {/* Sidebar Brand */}
        <div className="p-6 border-b border-slate-800/80">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="h-10 px-3 py-1 rounded-xl bg-white shadow-md border border-amber-400/40 flex items-center justify-center shrink-0">
              <img
                src="/logo/m3m-logo.png"
                alt="M3M Executive"
                className="h-6 w-auto max-w-[90px] object-contain"
              />
            </div>
            <div>
              <span className="block font-extrabold text-white text-base tracking-tight leading-tight">
                M3M Executive
              </span>
              <span className="block text-[11px] font-semibold text-amber-400">
                Portfolio Management
              </span>
            </div>
          </Link>
        </div>

        {/* User Badge */}
        {user && (
          <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-900/50">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">Logged in as</span>
            <span className="text-xs font-bold text-white truncate block">{user.name || user.email}</span>
            <span className="text-[11px] text-amber-400/80 truncate block">{user.email}</span>
          </div>
        )}

        {/* Menu Items */}
        <nav className="p-4 space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/90'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-amber-400 hover:bg-slate-900 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>View Public Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};
