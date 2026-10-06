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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
          Clinical Departments
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-1">
          Specialist Consultations & Departments
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          From cardiovascular interventions to primary wellness, find board-certified consultants tailored to your clinical requirements.
        </p>

        {/* Search */}
        <div className="relative mt-6 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search symptoms or specialties (e.g. Heart, Migraine)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>
      </div>

      {loading ? (
        <CardSkeleton count={8} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-sm text-slate-500">
          No clinical departments found matching "{search}".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
