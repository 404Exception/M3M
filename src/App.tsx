import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext.js';
import { ScrollToTop } from './components/ScrollToTop.js';
import { PublicLayout } from './components/PublicLayout.js';
import { LoadingFallback } from './components/common/LoadingFallback.js';

// Lazy loaded customer-facing pages
const HomePage = lazy(() => import('./pages/HomePage.js').then(m => ({ default: m.HomePage })));
const CorridorsPage = lazy(() => import('./pages/CorridorsPage.js').then(m => ({ default: m.CorridorsPage })));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage.js').then(m => ({ default: m.PortfolioPage })));
const SiteListingPage = lazy(() => import('./pages/SiteListingPage.js').then(m => ({ default: m.SiteListingPage })));
const SiteDetailsPage = lazy(() => import('./pages/SiteDetailsPage.js').then(m => ({ default: m.SiteDetailsPage })));
const BlogsPage = lazy(() => import('./pages/BlogsPage.js').then(m => ({ default: m.BlogsPage })));
const BlogDetailsPage = lazy(() => import('./pages/BlogDetailsPage.js').then(m => ({ default: m.BlogDetailsPage })));
const AboutPage = lazy(() => import('./pages/AboutPage.js').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage.js').then(m => ({ default: m.ContactPage })));

// Lazy loaded admin panel pages
const AdminLayout = lazy(() => import('./admin/AdminLayout.js').then(m => ({ default: m.AdminLayout })));
const AdminLoginPage = lazy(() => import('./admin/AdminLoginPage.js').then(m => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('./admin/AdminDashboardPage.js').then(m => ({ default: m.AdminDashboardPage })));
const AdminSitesListPage = lazy(() => import('./admin/AdminSitesListPage.js').then(m => ({ default: m.AdminSitesListPage })));
const AdminSiteFormPage = lazy(() => import('./admin/AdminSiteFormPage.js').then(m => ({ default: m.AdminSiteFormPage })));
const AdminLocationsPage = lazy(() => import('./admin/AdminLocationsPage.js').then(m => ({ default: m.AdminLocationsPage })));
const AdminSettingsPage = lazy(() => import('./admin/AdminSettingsPage.js').then(m => ({ default: m.AdminSettingsPage })));
const AdminBlogsListPage = lazy(() => import('./admin/AdminBlogsListPage.js').then(m => ({ default: m.AdminBlogsListPage })));
const AdminBlogFormPage = lazy(() => import('./admin/AdminBlogFormPage.js').then(m => ({ default: m.AdminBlogFormPage })));

export default function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<LoadingFallback message="Loading page..." />}>
          <Routes>
            {/* Customer Facing Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              
              {/* Prime Corridors Hub & Corridor Profiles */}
              <Route path="/corridors" element={<CorridorsPage />} />
              <Route path="/corridors/:slug" element={<SiteListingPage />} />
              <Route path="/locations" element={<CorridorsPage />} />
              <Route path="/locations/:slug" element={<SiteListingPage />} />
              
              {/* Complete 34-Project Master Portfolio Catalog */}
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/projects" element={<PortfolioPage />} />
              <Route path="/sites" element={<PortfolioPage />} />
              <Route path="/sites/:slug" element={<SiteDetailsPage />} />
              
              {/* Intelligence, About & Concierge */}
              <Route path="/blogs" element={<BlogsPage />} />
              <Route path="/blogs/:slug" element={<BlogDetailsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            {/* Admin Auth Route */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin Panel Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="sites" element={<AdminSitesListPage />} />
              <Route path="sites/new" element={<AdminSiteFormPage />} />
              <Route path="sites/:id/edit" element={<AdminSiteFormPage />} />
              <Route path="locations" element={<AdminLocationsPage />} />
              <Route path="blogs" element={<AdminBlogsListPage />} />
              <Route path="blogs/new" element={<AdminBlogFormPage />} />
              <Route path="blogs/:id/edit" element={<AdminBlogFormPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </SettingsProvider>
  );
}
