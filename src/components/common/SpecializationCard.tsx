import React from 'react';
import { Specialization } from '../../types';
import {
  Heart,
  Sparkles,
  Activity,
  Baby,
  Brain,
  Smile,
  UserCheck,
  Stethoscope,
  ChevronRight,
} from 'lucide-react';

interface SpecializationCardProps {
  specialization: Specialization;
  onClick: (spec: Specialization) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Heart: <Heart className="w-5 h-5 text-emerald-700" />,
  Sparkles: <Sparkles className="w-5 h-5 text-emerald-700" />,
  Activity: <Activity className="w-5 h-5 text-emerald-700" />,
  Baby: <Baby className="w-5 h-5 text-emerald-700" />,
  Brain: <Brain className="w-5 h-5 text-emerald-700" />,
  Smile: <Smile className="w-5 h-5 text-emerald-700" />,
  UserCheck: <UserCheck className="w-5 h-5 text-emerald-700" />,
  Stethoscope: <Stethoscope className="w-5 h-5 text-emerald-700" />,
};

export const SpecializationCard: React.FC<SpecializationCardProps> = ({
  specialization,
  onClick,
}) => {
  return (
    <button
      onClick={() => onClick(specialization)}
      className="group text-left bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/60 p-5 sm:p-6 transition-all duration-200 hover:shadow-md flex flex-col justify-between w-full h-full min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 active:scale-[0.99]"
    >
      <div className="w-full min-w-0">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-50/80 group-hover:bg-emerald-100/90 flex items-center justify-center transition-colors mb-4 border border-emerald-100 shrink-0">
          {iconMap[specialization.iconName] || <Stethoscope className="w-5 h-5 text-emerald-700" />}
        </div>

        <h3 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-emerald-950 transition-colors truncate">
          {specialization.name}
        </h3>

        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed break-words">
          {specialization.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-500 group-hover:text-emerald-900 font-medium w-full min-w-0">
        <span className="truncate">{specialization.doctorCount} Doctors available</span>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all shrink-0" />
      </div>
    </button>
  );
};
