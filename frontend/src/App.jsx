import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';

// Route-based code splitting
const Home = lazy(() => import('./pages/Home'));
const Events = lazy(() => import('./pages/Events'));
const About = lazy(() => import('./pages/About'));
const ProtectedAdmin = lazy(() => import('./components/ProtectedAdmin'));
// Landing no longer required for gating; could be removed or repurposed

function App() {
  return (
    <HashRouter>
      <Suspense fallback={<div className="p-8 text-center text-sm opacity-70">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<ProtectedAdmin />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
