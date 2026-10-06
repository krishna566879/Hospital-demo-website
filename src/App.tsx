import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/home/HomePage';
import { SpecialistsPage } from './components/pages/SpecialistsPage';
import { DoctorsPage } from './components/pages/DoctorsPage';
import { FacilitiesPage } from './components/pages/FacilitiesPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { BookingFlow } from './components/booking/BookingFlow';
import { MyAppointmentsPage } from './components/patient/MyAppointmentsPage';
import { PatientProfilePage } from './components/patient/PatientProfilePage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthPages } from './components/auth/AuthPages';
import { Doctor, Specialization, Appointment } from './types';
import { Calendar, Shield, Sparkles, User, ArrowRight } from 'lucide-react';

function MainApp() {
  const { user, switchRole } = useAuth();

  // Route state
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#/, '');
      return hash || '/';
    }
    return '/';
  });

  // Selected entities for deep-linking into booking
  const [selectedSpecializationSlug, setSelectedSpecializationSlug] = useState<string | undefined>();
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>();

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

  // Handlers for booking triggers from other pages
  const handleSelectSpecialization = (spec: Specialization) => {
    setSelectedSpecializationSlug(spec.slug);
    setSelectedDoctorId(undefined);
    navigate('/appointments/book');
  };

  const handleBookDoctor = (doctor: Doctor) => {
    setSelectedSpecializationSlug(doctor.specializationId);
    setSelectedDoctorId(doctor.id);
    navigate('/appointments/book');
  };

  // Determine active view from currentRoute
  const renderCurrentView = () => {
    // 1. Home
    if (currentRoute === '/' || currentRoute === '') {
      return (
        <HomePage
          navigate={navigate}
          onSelectSpecialization={handleSelectSpecialization}
          onBookDoctor={handleBookDoctor}
          onViewDoctorProfile={handleBookDoctor}
        />
      );
    }

    // 2. Specialists
    if (currentRoute === '/specialists' || currentRoute.startsWith('/specialists/')) {
      return <SpecialistsPage onSelectSpecialization={handleSelectSpecialization} />;
    }

    // 3. Doctors
    if (currentRoute === '/doctors' || currentRoute.startsWith('/doctors/')) {
      return <DoctorsPage onBookDoctor={handleBookDoctor} />;
    }

    // 4. Booking Flow
    if (currentRoute === '/appointments/book' || currentRoute === '/appointments/success') {
      return (
        <BookingFlow
          initialSpecializationSlug={selectedSpecializationSlug}
          initialDoctorId={selectedDoctorId}
          onBookingSuccess={(app: Appointment) => {
            // Stay on success view or navigate
          }}
          onNavigateHome={() => navigate('/')}
          onNavigateMyAppointments={() => navigate('/my-appointments')}
        />
      );
    }

    // 5. Patient My Appointments (Protected)
    if (currentRoute === '/my-appointments') {
      return <MyAppointmentsPage navigate={navigate} />;
    }

    // 6. Patient Profile (Protected)
    if (currentRoute === '/profile') {
      return <PatientProfilePage />;
    }

    // 7. Facilities
    if (currentRoute === '/facilities') {
      return <FacilitiesPage navigate={navigate} />;
    }

    // 8. About
    if (currentRoute === '/about') {
      return <AboutPage navigate={navigate} />;
    }

    // 9. Contact
    if (currentRoute === '/contact') {
      return <ContactPage />;
    }

    // 10. Auth routes
    if (currentRoute === '/login') {
      return <AuthPages initialMode="login" navigate={navigate} />;
    }
    if (currentRoute === '/signup') {
      return <AuthPages initialMode="signup" navigate={navigate} />;
    }
    if (currentRoute === '/forgot-password') {
      return <AuthPages initialMode="forgot-password" navigate={navigate} />;
    }

    // 11. Admin Panel
    if (currentRoute.startsWith('/admin')) {
      let subTab = 'overview';
      if (currentRoute.includes('/appointments')) subTab = 'appointments';
      else if (currentRoute.includes('/doctors')) subTab = 'doctors';
      else if (currentRoute.includes('/availability')) subTab = 'availability';
      else if (currentRoute.includes('/notifications')) subTab = 'notifications';

      return <AdminDashboard currentSubTab={subTab} navigate={navigate} />;
    }

    // Default fallback to Home
    return (
      <HomePage
        navigate={navigate}
        onSelectSpecialization={handleSelectSpecialization}
        onBookDoctor={handleBookDoctor}
        onViewDoctorProfile={handleBookDoctor}
      />
    );
  };

  const isAdminView = currentRoute.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-slate-800">
      {/* Prototype Reviewer Quick Bar */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-[11px] border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-medium text-white">Nivaan Hospital Prototype</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Architecture prepared for Supabase Backend</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400">Persona:</span>
          <button
            onClick={() => switchRole('patient')}
            className={`px-2 py-0.5 rounded transition-colors ${
              user?.role === 'patient'
                ? 'bg-emerald-800 text-emerald-100 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Patient (Rahul)
          </button>
          <button
            onClick={() => {
              switchRole('admin');
              navigate('/admin');
            }}
            className={`px-2 py-0.5 rounded transition-colors ${
              user?.role === 'admin'
                ? 'bg-emerald-800 text-emerald-100 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Hospital Admin
          </button>
        </div>
      </div>

      {/* Top Navbar */}
      <Navbar currentRoute={currentRoute} navigate={navigate} />

      {/* Main Viewport */}
      <main className="flex-1 pb-16">{renderCurrentView()}</main>

      {/* Mobile Sticky CTA Cap (max 15% viewport height, only shown on mobile when not already on booking screen) */}
      {!isAdminView && currentRoute !== '/appointments/book' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 shadow-lg flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-emerald-900 uppercase">Consult a Specialist</p>
            <p className="text-xs text-slate-500 truncate">Book appointment online</p>
          </div>
          <button
            onClick={() => navigate('/appointments/book')}
            className="px-4 py-2 bg-emerald-900 text-emerald-50 rounded-xl text-xs font-semibold whitespace-nowrap shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Now</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <Footer navigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainApp />
      </ToastProvider>
    </AuthProvider>
  );
}
