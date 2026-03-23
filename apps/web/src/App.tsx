import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react"
import { initTestMode } from "./lib/analytics";

// Capture ?test=true from URL before any components render
initTestMode();

/**
 * Wrap lazy() so a failed chunk load (stale deploy) triggers a full page reload.
 * A sessionStorage flag prevents infinite reload loops.
 */
function lazyWithRetry(factory: () => Promise<{ default: React.ComponentType }>) {
  return lazy(() =>
    factory().catch(() => {
      const reloaded = sessionStorage.getItem("chunk_reload");
      if (!reloaded) {
        sessionStorage.setItem("chunk_reload", "1");
        window.location.reload();
        return new Promise(() => {}); // never resolves — page is reloading
      }
      sessionStorage.removeItem("chunk_reload");
      return factory(); // second attempt: surface the real error
    }),
  );
}

const OnboardingPage = lazyWithRetry(
  () => import("./components/onboarding/OnboardingPage"),
);
const SalesPage = lazyWithRetry(() => import("./components/SalesPage"));
const ReportPage = lazyWithRetry(() => import("./components/report/ReportPage"));
const ThankYouPage = lazyWithRetry(() => import("./components/ThankYouPage"));
const AdminDashboard = lazyWithRetry(() => import("./components/admin/AdminDashboard"));

const pageFallback = (
  <div className="min-h-screen bg-harbor-bg flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-harbor-primary mb-2">Harbor</h1>
      <p className="text-harbor-text/40">Loading...</p>
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
    <Analytics />
      <Suspense fallback={pageFallback}>
        <Routes>
          <Route path="/" element={<Navigate to="/onboarding" replace />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/results" element={<SalesPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/onboarding" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
