import React from 'react';
import { HOSPITAL_FACILITIES } from '../../data/mockData';
import { Button } from '../ui/Button';
import { ShieldCheck, Microscope, Cpu, HeartPulse, ArrowRight } from 'lucide-react';

interface FacilitiesPageProps {
  navigate: (route: string) => void;
}

export const FacilitiesPage: React.FC<FacilitiesPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-12 sm:space-y-16">
      <div className="max-w-3xl min-w-0">
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 sm:px-3 py-1 rounded-full border border-emerald-200/60 inline-flex items-center gap-1.5 max-w-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
          <span className="truncate">Hospital Infrastructure</span>
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mt-2 break-words">
          Clinical Facilities & Diagnostic Infrastructure
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-2 leading-relaxed break-words">
          Designed with infection-barrier airflow, natural daylighting, and zero-panic ergonomics. Located at Arera Colony, Bhopal, our clinical campus bridges technology with human empathy.
        </p>
      </div>

      {/* Featured Large Facility Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {HOSPITAL_FACILITIES.map((facility) => (
          <div
            key={facility.id}
            className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between w-full min-w-0"
          >
            <div className="aspect-16/10 bg-slate-100 overflow-hidden w-full">
              <img
                src={facility.image}
                alt={facility.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="p-5 sm:p-7 md:p-8 flex-1 flex flex-col justify-between space-y-5">
              <div>
                <span className="text-[10px] sm:text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
                  {facility.category}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 break-words">
                  {facility.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed break-words">
                  {facility.description}
                </p>
              </div>

              <div className="pt-4 sm:pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>NABH Compliant Architecture</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/contact')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5 shrink-0" />}
                  className="text-xs self-start sm:self-auto"
                >
                  Contact Hospital
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Technology & Diagnostics Highlights */}
      <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-slate-800 space-y-6 sm:space-y-8">
        <div className="max-w-2xl min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block mb-1">
            Advanced Diagnostic Wings
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white break-words">
            Precision Imaging & Rapid Laboratory Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed break-words">
            Integrated electronic medical reporting allows specialists to review lab results and radiology scans instantaneously during your consultation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2 min-w-0">
            <Microscope className="w-5 h-5 text-emerald-400 shrink-0" />
            <h4 className="font-semibold text-white text-sm sm:text-base">Zero-Wait Pathology</h4>
            <p className="text-xs text-slate-400 leading-relaxed break-words">
              Automated biochemistry, hematology, and immunochemistry systems delivering critical results in minutes.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2 min-w-0">
            <Cpu className="w-5 h-5 text-emerald-400 shrink-0" />
            <h4 className="font-semibold text-white text-sm sm:text-base">3T MRI & Dual-Source CT</h4>
            <p className="text-xs text-slate-400 leading-relaxed break-words">
              Ultra-high resolution cross-sectional neuro and cardiac scanning with reduced scan times and quiet tunnels.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2 min-w-0">
            <HeartPulse className="w-5 h-5 text-emerald-400 shrink-0" />
            <h4 className="font-semibold text-white text-sm sm:text-base">Laminar Flow Modular OTs</h4>
            <p className="text-xs text-slate-400 leading-relaxed break-words">
              HEPA-filtered sterile operating suites configured for joint replacements, cardiothoracic, and laparoscopic surgery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
