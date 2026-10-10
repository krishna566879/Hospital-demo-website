import React, { useState, useEffect } from 'react';
import { Specialization } from '../../types';
import { hospitalService } from '../../services/hospitalService';
import { SpecializationCard } from '../common/SpecializationCard';
import { CardSkeleton } from '../ui/Skeletons';
import { Search } from 'lucide-react';

interface SpecialistsPageProps {
  onSelectSpecialization: (spec: Specialization) => void;
}

export const SpecialistsPage: React.FC<SpecialistsPageProps> = ({ onSelectSpecialization }) => {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    hospitalService.getSpecializations().then((data) => {
      setSpecializations(data);
      setLoading(false);
    });
  }, []);

  const filtered = specializations.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.commonConditions.some((c) => c.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-10">
      <div className="max-w-2xl min-w-0">
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 sm:px-3 py-1 rounded-full border border-emerald-200/60 inline-flex items-center gap-1.5 max-w-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
          <span className="truncate">Clinical Departments</span>
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mt-2 break-words">
          Specialist Consultations & Departments
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-2 leading-relaxed break-words">
          From cardiovascular interventions to primary wellness, find board-certified consultants tailored to your clinical requirements at Nivaan Hospital, Bhopal.
        </p>

        {/* Search */}
        <div className="relative mt-4 sm:mt-6 max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 shrink-0" />
          <input
            type="text"
            placeholder="Search symptoms or specialties (e.g. Heart, Joint)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-2xs"
          />
        </div>
      </div>

      {loading ? (
        <CardSkeleton count={8} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 text-sm text-slate-500">
          No clinical departments found matching "{search}".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((spec) => (
            <SpecializationCard
              key={spec.id}
              specialization={spec}
              onClick={onSelectSpecialization}
            />
          ))}
        </div>
      )}
    </div>
  );
};
