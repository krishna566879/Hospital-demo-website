import React from 'react';
import { HOSPITAL_INFO } from '../../data/mockData';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  PhoneCall,
  ExternalLink,
  MessageCircle,
  Instagram,
  Shield,
  Building,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-12">
      {/* Header section */}
      <div className="max-w-3xl min-w-0">
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 sm:px-3 py-1 rounded-full border border-emerald-200/60 inline-flex items-center gap-1.5 max-w-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
          <span className="truncate">Patient Support & Contact Information</span>
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mt-2.5 sm:mt-3 break-words">
          Contact Nivaan Multispeciality Hospital
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-2 sm:mt-3 leading-relaxed break-words">
          Conveniently located in Arera Colony, Bhopal. Connect directly with our outpatient department, 24/7 emergency care line, or reach our patient coordination team via phone, email, or WhatsApp.
        </p>
      </div>

      {/* Primary 24/7 Emergency Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-950 to-slate-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 border border-rose-800/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
        <div className="space-y-1.5 sm:space-y-2 min-w-0 flex-1">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-rose-300 bg-rose-950/80 px-2.5 py-1 rounded-lg border border-rose-700/60 max-w-full">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
            <span className="truncate">24/7 Trauma & Emergency Department</span>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white break-words">
            Immediate Emergency Response Hotline
          </h2>
          <p className="text-xs sm:text-sm text-rose-200/80 max-w-xl break-words">
            Round-the-clock emergency medical services, trauma triage, and rapid ICU mobilization team at Arera Colony, Bhopal.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
          <a
            href={`tel:${HOSPITAL_INFO.emergencyRaw}`}
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl transition-all shadow-md active:scale-[0.98] text-xs sm:text-sm w-full md:w-auto min-h-[44px]"
          >
            <PhoneCall className="w-4 h-4 shrink-0" />
            <span>Call {HOSPITAL_INFO.emergency}</span>
          </a>
        </div>
      </div>

      {/* Main Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Phone / OPD Inquiries */}
        <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 p-5 sm:p-6 lg:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 sm:space-y-6 min-w-0">
          <div className="space-y-3 sm:space-y-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                General & OPD Desk
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">Telephone Support</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed break-words">
                Connect with our front-desk coordinators for doctor availability, outpatient timings, and general hospital inquiries.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <a
              href={`tel:${HOSPITAL_INFO.phoneRaw}`}
              className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-emerald-950 hover:text-emerald-700 transition-colors group max-w-full"
            >
              <span className="tabular-nums truncate">{HOSPITAL_INFO.phone}</span>
              <ExternalLink className="w-4 h-4 text-emerald-600 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
            </a>
            <p className="text-[11px] text-slate-400 mt-1">Tap to call directly from your device</p>
          </div>
        </div>

        {/* Card 2: WhatsApp Coordination */}
        <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 p-5 sm:p-6 lg:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 sm:space-y-6 min-w-0">
          <div className="space-y-3 sm:space-y-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                Instant Chat Assistance
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">WhatsApp Us</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed break-words">
                Send a message to our hospital coordinator for quick responses on doctor schedules, hospital location, and departments.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <a
              href={HOSPITAL_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-50 text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs active:scale-[0.98] min-h-[42px]"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Message on WhatsApp</span>
            </a>
            <p className="text-[11px] text-center text-slate-400 mt-2 truncate">
              Opens chat with {HOSPITAL_INFO.phone}
            </p>
          </div>
        </div>

        {/* Card 3: Email Support */}
        <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 p-5 sm:p-6 lg:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 sm:space-y-6 min-w-0">
          <div className="space-y-3 sm:space-y-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200/60 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Official Correspondence
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">Email Desk</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed break-words">
                For administrative requests, corporate inquiries, feedback, and medical record requests.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <a
              href={`mailto:${HOSPITAL_INFO.email}`}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 hover:text-emerald-800 transition-colors group break-all max-w-full"
            >
              <span>{HOSPITAL_INFO.email}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
            </a>
            <p className="text-[11px] text-slate-400 mt-1">Click to open default mail client</p>
          </div>
        </div>

        {/* Card 4: Operating Hours */}
        <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 p-5 sm:p-6 lg:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 sm:space-y-6 min-w-0">
          <div className="space-y-3 sm:space-y-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200/60 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Schedule & Timings
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">Opening Hours</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed break-words">
                Regular specialist outpatient clinics and round-the-clock emergency access.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2 py-1">
              <span className="text-slate-600 font-medium">OPD Consultations</span>
              <span className="font-semibold text-slate-900 sm:text-right">Mon–Sat: 9:00 AM – 8:00 PM</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2 py-1 border-t border-slate-100">
              <span className="text-slate-600 font-medium">Emergency Care</span>
              <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-[11px] w-fit">24/7 Open</span>
            </div>
          </div>
        </div>

        {/* Card 5: Social Media / Instagram */}
        <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 p-5 sm:p-6 lg:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 sm:space-y-6 min-w-0">
          <div className="space-y-3 sm:space-y-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center border border-pink-100 shrink-0">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-pink-700 uppercase tracking-wider block">
                Social Community
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">Instagram</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed break-words">
                Follow our doctors for medical wellness tips, preventive health awareness, and hospital updates.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <a
              href={HOSPITAL_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-900 hover:text-pink-600 transition-colors group"
            >
              <span>{HOSPITAL_INFO.instagram}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-600 transition-colors shrink-0" />
            </a>
            <p className="text-[11px] text-slate-400 mt-1">Visit official Instagram profile</p>
          </div>
        </div>

        {/* Card 6: Accreditation & Standards */}
        <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 p-5 sm:p-6 lg:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 sm:space-y-6 min-w-0">
          <div className="space-y-3 sm:space-y-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                Quality Standards
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">Accredited Healthcare</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed break-words">
                Operating with certified clinical protocols, infection control guidelines, and patient safety benchmarks.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs font-semibold text-emerald-900">NABH Standards Compliant</span>
            <p className="text-[11px] text-slate-400 mt-1">Dedicated to continuous clinical excellence</p>
          </div>
        </div>
      </div>

      {/* Hospital Campus Address & Location Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-8 lg:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="lg:col-span-7 space-y-3 sm:space-y-4 min-w-0">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
              <Building className="w-3.5 h-3.5 shrink-0" />
              <span>Campus Location</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 break-words">
              {HOSPITAL_INFO.name}
            </h3>

            <div className="flex items-start gap-2.5 sm:gap-3 pt-1">
              <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-1 min-w-0">
                <p className="text-xs sm:text-sm md:text-base text-slate-800 font-medium leading-relaxed break-words">
                  {HOSPITAL_INFO.address}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed break-words">
                  Located in the healthcare corridor of Arera Colony, easily accessible from Habibganj and MP Nagar, Bhopal.
                </p>
              </div>
            </div>

            <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
              <a
                href={HOSPITAL_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs active:scale-[0.98] w-full sm:w-auto min-h-[42px]"
              >
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Get Directions on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </a>

              <a
                href={`tel:${HOSPITAL_INFO.phoneRaw}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-medium rounded-xl transition-colors w-full sm:w-auto min-h-[42px]"
              >
                <Phone className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span>Call Reception: {HOSPITAL_INFO.phone}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 w-full">
            <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-100 aspect-16/10 w-full">
              <img
                src={HOSPITAL_INFO.interiorImage}
                alt="Nivaan Multispeciality Hospital interior reception and patient lounge"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
