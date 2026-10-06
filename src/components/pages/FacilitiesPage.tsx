import React from 'react';
import { HOSPITAL_FACILITIES, HOSPITAL_INFO } from '../../data/mockData';
import { Button } from '../ui/Button';
import { Building2, ShieldCheck, Microscope, Cpu, Sparkles, HeartPulse, ArrowRight } from 'lucide-react';

interface FacilitiesPageProps {
  navigate: (route: string) => void;
}

export const FacilitiesPage: React.FC<FacilitiesPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      <div className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
          Hospital Infrastructure
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-1">
          Clinical Facilities & Diagnostic Infrastructure
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
          Designed with infection-barrier airflow, natural daylighting, and zero-panic ergonomics. Located at Arera Colony, Bhopal, our clinical campus bridges technology with human empathy.
        </p>
      </div>

      {/* Featured Large Facility Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {HOSPITAL_FACILITIES.map((facility, idx) => (
          <div
            key={facility.id}
            className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="aspect-16/10 bg-slate-100 overflow-hidden">
              <img
                src={facility.image}
                alt={facility.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
                  {facility.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{facility.title}</h3>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  {facility.description}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  NABH Compliant Architecture
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/appointments/book')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  className="text-xs"
                >
                  Book Visit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Technology & Diagnostics Highlights */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-8">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Advanced Diagnostic Wings
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-white">
            Precision Imaging & Rapid Laboratory Services
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Integrated electronic medical reporting allows specialists to review lab results and radiology scans instantaneously during your consultation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
            <Microscope className="w-5 h-5 text-emerald-400" />
            <h4 className="font-semibold text-white text-base">Zero-Wait Pathology</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated biochemistry, hematology, and immunochemistry systems delivering critical results in minutes.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h4 className="font-semibold text-white text-base">3T MRI & Dual-Source CT</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ultra-high resolution cross-sectional neuro and cardiac scanning with reduced scan times and quiet tunnels.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
            <HeartPulse className="w-5 h-5 text-emerald-400" />
            <h4 className="font-semibold text-white text-base">Laminar Flow Modular OTs</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              HEPA-filtered sterile operating suites configured for joint replacements, cardiothoracic, and laparoscopic surgery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
