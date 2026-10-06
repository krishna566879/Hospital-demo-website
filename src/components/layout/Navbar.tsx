import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HOSPITAL_INFO } from '../../data/mockData';
import { Menu, X, PhoneCall, Calendar, User, ShieldCheck, LogOut } from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, navigate }) => {
  const { user, logout, switchRole } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', route: '/' },
    { label: 'Specialists', route: '/specialists' },
    { label: 'Doctors', route: '/doctors' },
    { label: 'Facilities', route: '/facilities' },
    { label: 'About', route: '/about' },
    { label: 'Contact', route: '/contact' },
  ];

  const handleNavClick = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/80 py-3'
            : 'bg-[#FBFBFA]/90 backdrop-blur-xs border-b border-slate-200/40 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Zone 1: Brand wordmark (single text element as per Top Bar Contract) */}
          <button
            onClick={() => handleNavClick('/')}
            className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-md"
          >
            NIVAAN
          </button>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => handleNavClick(link.route)}
                  className={`relative py-1 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded ${
                    isActive ? 'text-emerald-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-800 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick emergency call affordance */}
            <a
              href={`tel:${HOSPITAL_INFO.emergency}`}
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-medium text-rose-700 hover:text-rose-800 bg-rose-50/70 hover:bg-rose-100/80 px-2.5 py-1.5 rounded-lg border border-rose-200/60 transition-colors whitespace-nowrap"
              title="24/7 Emergency Line"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
              <span>Emergency</span>
            </a>

            {/* Book Appointment CTA */}
            <button
              onClick={() => handleNavClick('/appointments/book')}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium text-emerald-50 bg-emerald-900 hover:bg-emerald-800 rounded-xl transition-all shadow-xs border border-emerald-950/20 whitespace-nowrap active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>

            {/* User / Portal Dropdown or Quick Switch */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 text-xs font-medium"
                    aria-label="User menu"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-semibold text-xs">
                      {user.name[0]}
                    </div>
                    <span className="hidden xl:inline max-w-[90px] truncate text-slate-800">{user.name.split(' ')[0]}</span>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {user.role}
                        </span>
                      </div>

                      {user.role === 'patient' && (
                        <>
                          <button
                            onClick={() => handleNavClick('/my-appointments')}
                            className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                          >
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            My Appointments
                          </button>
                          <button
                            onClick={() => handleNavClick('/profile')}
                            className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                          >
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            Patient Profile
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleNavClick('/admin')}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Admin Dashboard
                      </button>

                      <div className="border-t border-slate-100 my-1 pt-1">
                        <p className="px-3 py-1 text-[10px] text-slate-400 uppercase font-semibold">Switch Persona</p>
                        <div className="grid grid-cols-2 gap-1 px-1">
                          <button
                            onClick={() => switchRole('patient')}
                            className="text-[11px] py-1 px-2 rounded text-slate-600 hover:bg-slate-100 text-left font-medium"
                          >
                            Patient
                          </button>
                          <button
                            onClick={() => switchRole('admin')}
                            className="text-[11px] py-1 px-2 rounded text-slate-600 hover:bg-slate-100 text-left font-medium"
                          >
                            Admin
                          </button>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-500" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleNavClick('/login')}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors text-xs font-medium"
                  title="Sign In"
                >
                  <User className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus-visible:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu sheet */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in fade-in">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.route}
                  onClick={() => handleNavClick(link.route)}
                  className={`text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentRoute === link.route ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('/my-appointments')}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 font-medium"
              >
                <Calendar className="w-4 h-4 text-emerald-700" />
                My Appointments
              </button>
              <button
                onClick={() => handleNavClick('/admin')}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 font-medium"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Admin Console
              </button>
              <a
                href={`tel:${HOSPITAL_INFO.emergency}`}
                className="flex items-center justify-center gap-2 py-2 text-sm font-semibold text-rose-700 bg-rose-50 rounded-xl border border-rose-200"
              >
                <PhoneCall className="w-4 h-4" />
                Emergency Line: {HOSPITAL_INFO.emergency}
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
