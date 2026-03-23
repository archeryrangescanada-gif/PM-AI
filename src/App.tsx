/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import TenantDashboard from './pages/TenantDashboard';
import LandlordDashboard from './pages/LandlordDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#0C1628' }}>
      <h1 className="text-5xl font-bold text-white mb-4">404 — Page not found</h1>
      <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-semibold hover:bg-[var(--color-primary-dark)] transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/tenant" element={<TenantDashboard />} />
        <Route path="/tenant/dashboard" element={<TenantDashboard />} />
        <Route path="/landlord" element={<LandlordDashboard />} />
        <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
        <Route path="/provider" element={<ProviderDashboard />} />
        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
