import React from 'react';
import { Doctor } from '../../types';
import { Button } from '../ui/Button';
import { Calendar, UserCheck, Star, Clock } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
  onViewProfile?: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook, onViewProfile }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300/80 transition-all duration-200 hover:shadow-md flex flex-col justify-between overflow-hidden group">
      <div className="p-5 sm:p-6">
        {/* Top Header */}
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
            <img
              src={doctor.photoUrl}
              alt={doctor.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                // Fallback icon placeholder if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Fallback container */}
            <div className="absolute inset-0 -z-10 bg-emerald-50 flex items-center justify-center text-emerald-800 font-bold text-lg">
              {doctor.name.split(' ')[1]?.[0] || 'Dr'}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-slate-900 group-hover:text-emerald-950 transition-colors truncate">
              {doctor.name}
            </h3>
            <p className="text-xs text-emerald-800 font-medium truncate mt-0.5">
              {doctor.title}
            </p>

            {/* Zero-Pill Unboxed Metadata with Typographic Separators */}
            <div className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 mt-2">
              <span>{doctor.experienceYears} yrs experience</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{doctor.languages.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Bio excerpt */}
        <p className="text-xs text-slate-600 line-clamp-2 mt-4 leading-relaxed">
          {doctor.bio}
        </p>

        {/* Availability status line */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{doctor.nextAvailability}</span>
          </div>

          <div className="flex items-center gap-1 text-slate-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-800 tabular-nums">{doctor.rating}</span>
            <span className="text-[11px] text-slate-400 tabular-nums">({doctor.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 sm:px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-slate-500 block leading-tight">Consultation Fee</span>
          <span className="text-sm font-semibold text-slate-900 tabular-nums">
            ₹{doctor.consultationFee}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onViewProfile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewProfile(doctor)}
              className="text-xs px-2.5 py-1.5"
            >
              Profile
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={() => onBook(doctor)}
            leftIcon={<Calendar className="w-3.5 h-3.5" />}
          >
            Book Slot
          </Button>
        </div>
      </div>
    </div>
  );
};
