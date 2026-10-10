import React, { useState, useEffect, useRef } from 'react';
import { HOSPITAL_INFO } from '../../data/mockData';
import {
  Menu,
  X,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, navigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Track window scroll for subtle elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu when screen resizes to desktop breakpoint (e.g. tablet rotation)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

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
  };

  return (
    <header
      ref={navRef}
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/80 py-2 sm:py-2.5'
          : 'bg-[#FBFBFA]/95 backdrop-blur-xs border-b border-slate-200/50 py-2.5 sm:py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 md:gap-6 min-w-0">
        {/* Brand wordmark - Clean "Nivaan" logo only without long subtitle */}
        <button
          onClick={() => handleNavClick('/')}
          className="flex items-center gap-2 sm:gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-lg group shrink-0 min-w-0 py-1"
          aria-label="Nivaan Home"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-900 text-white flex items-center justify-center font-bold text-sm sm:text-base tracking-tight shadow-xs group-hover:bg-emerald-800 transition-colors shrink-0">
            N
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-none select-none truncate">
            Nivaan
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-1 lg:gap-3 xl:gap-6 text-xs lg:text-sm font-medium text-slate-600 min-w-0"
        >
          {navLinks.map((link) => {
            const isActive = currentRoute === link.route;
            return (
              <button
                key={link.route}
                onClick={() => handleNavClick(link.route)}
                className={`relative px-2 lg:px-3 py-1.5 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-md shrink-0 ${
                  isActive
                    ? 'text-emerald-950 font-semibold'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/60'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-800 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Header Actions - WhatsApp on desktop, Contact Us, Mobile Menu button */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* WhatsApp Us CTA - visible on lg screens (1024px+) */}
          <a
            href={HOSPITAL_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-900 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100/90 px-3 py-2 rounded-xl border border-emerald-200/80 transition-colors whitespace-nowrap shadow-2xs min-h-[38px]"
            title="Chat with us on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>WhatsApp Us</span>
          </a>

          {/* Contact Us button - always visible, adapts nicely on small mobile */}
          <button
            onClick={() => handleNavClick('/contact')}
            className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-emerald-50 bg-emerald-900 hover:bg-emerald-800 rounded-xl transition-all shadow-xs border border-emerald-950/20 whitespace-nowrap active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 min-h-[38px] shrink-0"
          >
            <span className="hidden min-[360px]:inline">Contact Us</span>
            <span className="min-[360px]:hidden">Contact</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-80 shrink-0" />
          </button>

          {/* Mobile Menu Toggle Button (< 768px) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-slate-950 rounded-xl hover:bg-slate-100 active:bg-slate-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 min-w-[38px] min-h-[38px] flex items-center justify-center shrink-0 transition-colors"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 shrink-0 text-slate-900" />
            ) : (
              <Menu className="w-5 h-5 shrink-0 text-slate-900" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Sheet */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/90 bg-white/98 backdrop-blur-md px-3.5 sm:px-6 pt-3 pb-5 space-y-3 shadow-lg animate-in fade-in slide-in-from-top-1 duration-150 max-h-[calc(100dvh-4.5rem)] overflow-y-auto">
          <nav aria-label="Mobile Navigation" className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => handleNavClick(link.route)}
                  className={`text-left px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors min-h-[44px] flex items-center justify-between ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-950 font-semibold border-l-4 border-emerald-800'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href={HOSPITAL_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100/80 rounded-xl border border-emerald-200/90 transition-colors min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>WhatsApp Us: {HOSPITAL_INFO.phone}</span>
            </a>

            <button
              onClick={() => handleNavClick('/contact')}
              className="w-full text-center py-2.5 px-3 text-sm font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-xl shadow-xs transition-all active:scale-[0.99] min-h-[44px] flex items-center justify-center gap-1.5"
            >
              <span>Contact Hospital Reception</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
