import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/home/HomePage';
import { SpecialistsPage } from './components/pages/SpecialistsPage';
import { DoctorsPage } from './components/pages/DoctorsPage';
import { FacilitiesPage } from './components/pages/FacilitiesPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { Specialization } from './types';

function MainApp() {
  // Route state
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#/, '');
      return hash || '/';
    }
    return '/';
  });

  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string | undefined>();

  // Sync route with window.location.hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      setCurrentRoute(hash || '/');
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string) => {
    window.location.hash = route;
    setCurrentRoute(route);
    window.scrollTo(0, 0);
  };

  const handleSelectSpecialization = (spec: Specialization) => {
    setSelectedSpecialtyId(spec.id);
    navigate('/doctors');
  };

  const handleViewDoctorProfile = (doctor: any) => {
    setSelectedSpecialtyId(doctor.specializationId);
    navigate('/doctors');
  };

  // Determine active view from currentRoute
  const renderCurrentView = () => {
    if (currentRoute === '/' || currentRoute === '') {
      return (
        <HomePage
          navigate={navigate}
          onSelectSpecialization={handleSelectSpecialization}
          onViewDoctorProfile={handleViewDoctorProfile}
        />
      );
    }

    if (currentRoute === '/specialists' || currentRoute.startsWith('/specialists/')) {
      return <SpecialistsPage onSelectSpecialization={handleSelectSpecialization} />;
    }

    if (currentRoute === '/doctors' || currentRoute.startsWith('/doctors/')) {
      return <DoctorsPage navigate={navigate} initialSpecialtyId={selectedSpecialtyId} />;
    }

    if (currentRoute === '/facilities') {
      return <FacilitiesPage navigate={navigate} />;
    }

    if (currentRoute === '/about') {
      return <AboutPage navigate={navigate} />;
    }

    if (currentRoute === '/contact') {
      return <ContactPage />;
    }

    // Fallback to Home
    return (
      <HomePage
        navigate={navigate}
        onSelectSpecialization={handleSelectSpecialization}
        onViewDoctorProfile={handleViewDoctorProfile}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-slate-800 antialiased overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation */}
      <Navbar currentRoute={currentRoute} navigate={navigate} />

      {/* Main Content Area */}
      <main className="flex-1 pb-10 md:pb-12 min-w-0">{renderCurrentView()}</main>

      {/* Footer */}
      <Footer navigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
