import React from 'react';
import { HOSPITAL_INFO } from '../../data/mockData';
import { Phone, Mail, MapPin, Clock, Shield, HeartHandshake } from 'lucide-react';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Positioning */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-1">
              <span className="text-xl font-bold tracking-tight text-white block">
                NIVAAN
              </span>
              <p className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                Multispeciality Hospital · Bhopal
              </p>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              “{HOSPITAL_INFO.tagline}” A premier healthcare institution in Central India dedicated to accessible, expert clinical care, modern diagnostic infrastructure, and patient-centered healing.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>NABH Accredited Healthcare Standards</span>
            </div>
          </div>

          {/* Col 2: Clinical Services */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Specializations
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => navigate('/specialists')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Cardiology & Vascular
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/specialists')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Orthopedics & Joint Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/specialists')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Clinical Dermatology
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/specialists')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Pediatrics & Neonatology
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/specialists')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Neurological Sciences
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/specialists')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  General & Internal Medicine
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Patient Portal
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => navigate('/appointments/book')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Book an Appointment
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/my-appointments')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  My Appointments
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/doctors')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Find a Doctor
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/facilities')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Hospital Facilities
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/admin')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Staff & Admin Console
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Emergency */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Hospital Contact
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{HOSPITAL_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${HOSPITAL_INFO.phone}`} className="hover:text-white transition-colors">
                  {HOSPITAL_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-rose-300 font-semibold">
                <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                <a href={`tel:${HOSPITAL_INFO.emergency}`} className="hover:text-rose-200 transition-colors">
                  Emergency: {HOSPITAL_INFO.emergency}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${HOSPITAL_INFO.email}`} className="hover:text-white transition-colors">
                  {HOSPITAL_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-slate-200">{HOSPITAL_INFO.openingHours.opdWeekdays}</p>
                  <p>{HOSPITAL_INFO.openingHours.opdSunday}</p>
                  <p className="text-rose-400 font-medium">24/7 Emergency Department</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-emerald-500" />
            <span>© {new Date().getFullYear()} Nivaan Multispeciality Hospital. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/about')} className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => navigate('/about')} className="hover:text-slate-400 transition-colors">
              Terms of Care
            </button>
            <button onClick={() => navigate('/contact')} className="hover:text-slate-400 transition-colors">
              Patient Rights
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
