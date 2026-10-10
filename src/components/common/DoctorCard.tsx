import React from 'react';
import { Doctor } from '../../types';
import { Button } from '../ui/Button';
import { Star, Phone, User } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  onContact?: (doctor: Doctor) => void;
  onViewProfile?: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onContact, onViewProfile }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300/80 transition-all duration-200 hover:shadow-md flex flex-col justify-between overflow-hidden group h-full w-full min-w-0">
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Top Header */}
          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
              <img
                src={doctor.photoUrl}
                alt={doctor.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 -z-10 bg-emerald-50 flex items-center justify-center text-emerald-800 font-bold text-base sm:text-lg">
                {doctor.name.split(' ')[1]?.[0] || 'Dr'}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-emerald-950 transition-colors truncate">
                {doctor.name}
              </h3>
              <p className="text-xs text-emerald-800 font-medium truncate mt-0.5">
                {doctor.title}
              </p>

              <div className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 mt-1.5">
                <span className="whitespace-nowrap">{doctor.experienceYears} yrs exp</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="truncate max-w-[130px]">{doctor.languages.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Bio excerpt */}
          <p className="text-xs text-slate-600 line-clamp-2 mt-3 leading-relaxed break-words">
            {doctor.bio}
          </p>
        </div>

        {/* Availability status line */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium min-w-0 flex-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            <span className="truncate text-[11px] sm:text-xs">OPD: {doctor.availableHours.start}–{doctor.availableHours.end}</span>
          </div>

          <div className="flex items-center gap-1 text-slate-500 shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
            <span className="font-semibold text-slate-800 tabular-nums">{doctor.rating}</span>
            <span className="text-[11px] text-slate-400 tabular-nums">({doctor.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-100 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500 font-medium">OPD Consultation Fee</span>
          <span className="text-sm font-semibold text-slate-900 tabular-nums">
            ₹{doctor.consultationFee}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 w-full">
          {onViewProfile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewProfile(doctor)}
              className="w-full text-xs px-2 py-2 min-h-[38px]"
              leftIcon={<User className="w-3.5 h-3.5 text-slate-500" />}
            >
              Profile
            </Button>
          )}
          {onContact && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onContact(doctor)}
              leftIcon={<Phone className="w-3.5 h-3.5 shrink-0" />}
              className={`w-full text-xs px-2 py-2 min-h-[38px] ${!onViewProfile ? 'col-span-2' : ''}`}
            >
              Contact OPD
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
