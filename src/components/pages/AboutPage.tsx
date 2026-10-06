import React from 'react';
import { HOSPITAL_INFO } from '../../data/mockData';
import { Button } from '../ui/Button';
import { ShieldCheck, Heart, Award, Users, CheckCircle, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  navigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-20">
      {/* Intro */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            About Nivaan Multispeciality Hospital
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            25+ Years of Trust, Science, and Healing in Bhopal.
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Founded with a vision to make tertiary medical expertise accessible without unnecessary friction, Nivaan Multispeciality Hospital stands as one of Central India’s premier healthcare destinations.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our campus at 42 Arera Medical Avenue houses 18+ medical disciplines under one roof. We combine leading clinicians, modern diagnostic technologies, and an empathetic, patient-first care philosophy.
          </p>

          <div className="pt-2 flex items-center gap-4">
            <Button variant="primary" onClick={() => navigate('/appointments/book')}>
              Book Consultation
            </Button>
            <Button variant="outline" onClick={() => navigate('/doctors')}>
              Meet Our Consultants
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-4/3">
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
      <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
          {HOSPITAL_INFO.stats.map((stat, i) => (
            <div key={i} className="space-y-1">
              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-emerald-300 tabular-nums">
                {stat.value}
              </span>
              <p className="text-xs text-emerald-100 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-10">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Our Guiding Pillars
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Built on Medical Ethics & Human Respect
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Clinical Integrity</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every diagnosis and treatment plan is rooted strictly in evidence-based medicine and clinical justification.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Patient Dignity</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Respectful communication, transparent counseling on procedures, and comfortable recovery environments.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Continuous Excellence</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ongoing clinical audits, stringent infection control benchmarks, and continuous training for medical staff.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
