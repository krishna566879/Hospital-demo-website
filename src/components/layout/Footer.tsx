import React from 'react';
import { HOSPITAL_INFO } from '../../data/mockData';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  HeartHandshake,
  MessageCircle,
  Instagram,
} from 'lucide-react';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 mt-16 sm:mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 sm:gap-10">
          {/* Col 1: Brand & Positioning */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-3.5 sm:space-y-4 min-w-0">
            <div className="space-y-1">
              <span className="text-xl font-bold tracking-tight text-white block">
                NIVAAN
              </span>
              <p className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                Multispeciality Hospital · Bhopal
              </p>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed break-words">
              “{HOSPITAL_INFO.tagline}” A premier healthcare institution in Central India dedicated to accessible, expert clinical care, modern diagnostic infrastructure, and patient-centered healing.
            </p>
            <div className="pt-1 flex items-center gap-2.5 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>NABH Accredited Healthcare Standards</span>
            </div>
            <div className="pt-1 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <a
                href={HOSPITAL_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-400 transition-colors inline-flex items-center gap-1.5 py-1"
              >
                <Instagram className="w-4 h-4 shrink-0 text-pink-400" />
                <span>{HOSPITAL_INFO.instagram}</span>
              </a>
              <a
                href={HOSPITAL_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 py-1"
              >
                <MessageCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* Col 2: Clinical Services */}
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 sm:mb-4">
              Specializations
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => navigate('/specialists')}
                  className="hover:text-emerald-400 transition-colors text-left py-0.5"
                >
                  Cardiology & Vascular
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/specialists')}
                  className="hover:text-emerald-400 transition-colors text-left py-0.5"
                >
                  Orthopedics & Joint Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/specialists')}
                  className="hover:text-emerald-400 transition-colors text-left py-0.5"
                >
                  Clinical Dermatology
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/specialists')}
                  className="hover:text-emerald-400 transition-colors text-left py-0.5"
                >
                  Pediatrics & Neonatology
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/specialists')}
                  className="hover:text-emerald-400 transition-colors text-left py-0.5"
                >
                  Neurological Sciences
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/specialists')}
                  className="hover:text-emerald-400 transition-colors text-left py-0.5"
                >
                  General & Internal Medicine
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Public Hospital Directory */}
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 sm:mb-4">
              Hospital Directory
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => navigate('/doctors')}
                  className="hover:text-emerald-400 transition-colors text-left py-0.5"
                >
                  Meet Our Doctors
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/specialists')}
                  className="hover:text-emerald-400 transition-colors text-left py-0.5"
                >
                  Explore Specialists
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/facilities')}
                  className="hover:text-emerald-400 transition-colors text-left py-0.5"
                >
                  Hospital Facilities
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-emerald-400 transition-colors text-left py-0.5"
                >
                  About Nivaan Hospital
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-emerald-400 transition-colors text-left py-0.5"
                >
                  Contact & OPD Hours
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Emergency */}
          <div className="sm:col-span-2 lg:col-span-1 min-w-0">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 sm:mb-4">
              Hospital Contact
            </h4>
            <ul className="space-y-2.5 sm:space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed break-words">{HOSPITAL_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${HOSPITAL_INFO.phoneRaw}`} className="hover:text-white transition-colors tabular-nums">
                  {HOSPITAL_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2 text-rose-300 font-semibold">
                <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                <a href={`tel:${HOSPITAL_INFO.emergencyRaw}`} className="hover:text-rose-200 transition-colors tabular-nums">
                  Emergency: {HOSPITAL_INFO.emergency}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${HOSPITAL_INFO.email}`} className="hover:text-white transition-colors break-all">
                  {HOSPITAL_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-2 pt-1">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-slate-200">{HOSPITAL_INFO.openingHours.opd}</p>
                  <p className="text-rose-400 font-medium">Emergency: 24/7</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <HeartHandshake className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>© {new Date().getFullYear()} Nivaan Multispeciality Hospital. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6">
            <button onClick={() => navigate('/about')} className="hover:text-slate-400 transition-colors py-1">
              Privacy & Ethics
            </button>
            <button onClick={() => navigate('/about')} className="hover:text-slate-400 transition-colors py-1">
              Patient Care Standards
            </button>
            <button onClick={() => navigate('/contact')} className="hover:text-slate-400 transition-colors py-1">
              Hospital Location
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
