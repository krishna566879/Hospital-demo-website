import React from 'react';
import { HOSPITAL_INFO } from '../../data/mockData';
import { Button } from '../ui/Button';
import { ShieldCheck, Heart, Award } from 'lucide-react';

interface AboutPageProps {
  navigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-12 sm:space-y-16 lg:space-y-20">
      {/* Intro */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-4 sm:space-y-6 min-w-0">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 sm:px-3 py-1 rounded-full border border-emerald-200/60 inline-flex items-center gap-1.5 max-w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
            <span className="truncate">About Nivaan Multispeciality Hospital</span>
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight break-words">
            25+ Years of Trust, Science, and Healing in Bhopal.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed break-words">
            Founded with a vision to make tertiary medical expertise accessible without unnecessary friction, Nivaan Multispeciality Hospital stands as one of Central India’s premier healthcare destinations.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
            Our campus at 42 Arera Medical Avenue houses 18+ medical disciplines under one roof. We combine leading clinicians, modern diagnostic technologies, and an empathetic, patient-first care philosophy.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
            <Button
              variant="primary"
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto justify-center"
            >
              Contact Hospital
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/doctors')}
              className="w-full sm:w-auto justify-center"
            >
              Meet Our Consultants
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5 w-full">
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-4/3 w-full">
            <img
              src={HOSPITAL_INFO.interiorImage}
              alt="Hospital atrium and modern reception"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Stats Counter Section */}
      <div className="bg-emerald-950 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 text-center">
          {HOSPITAL_INFO.stats.map((stat, i) => (
            <div key={i} className="space-y-1 min-w-0">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-emerald-300 tabular-nums block">
                {stat.value}
              </span>
              <p className="text-[11px] sm:text-xs text-emerald-100 font-medium truncate">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-6 sm:space-y-8">
        <div className="max-w-2xl min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 block mb-1">
            Our Guiding Pillars
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 break-words">
            Built on Medical Ethics & Human Respect
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/90 space-y-2.5 sm:space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Clinical Integrity</h3>
            <p className="text-xs text-slate-600 leading-relaxed break-words">
              Every diagnosis and treatment plan is rooted strictly in evidence-based medicine and clinical justification.
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/90 space-y-2.5 sm:space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Patient Dignity</h3>
            <p className="text-xs text-slate-600 leading-relaxed break-words">
              Respectful communication, transparent counseling on procedures, and comfortable recovery environments.
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/90 space-y-2.5 sm:space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Continuous Excellence</h3>
            <p className="text-xs text-slate-600 leading-relaxed break-words">
              Ongoing clinical audits, stringent infection control benchmarks, and continuous training for medical staff.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
