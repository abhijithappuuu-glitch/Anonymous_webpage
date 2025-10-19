import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import Jarvis from './components/Jarvis';

// Route-based code splitting
const Home = lazy(() => import('./pages/Home'));
const Events = lazy(() => import('./pages/Events'));
const About = lazy(() => import('./pages/About'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ProtectedAdmin = lazy(() => import('./components/ProtectedAdmin'));

// Optimized loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <div className="text-center">
      <div className="animate-spin w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-green-400 font-mono text-sm animate-pulse">
        &gt; LOADING_SYSTEM...
      </p>
    </div>
  </div>
);

function App() {
  return (
    <HashRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<ProtectedAdmin />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        
        {/* Jarvis AI Assistant - Available on all pages */}
        <Jarvis />
      </Suspense>
    </HashRouter>
  );
}

export default App;
