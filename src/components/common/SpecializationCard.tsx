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
      className="group text-left bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/60 p-6 transition-all duration-200 hover:shadow-md flex flex-col justify-between w-full h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
    >
      <div>
        <div className="w-12 h-12 rounded-xl bg-emerald-50/80 group-hover:bg-emerald-100/90 flex items-center justify-center transition-colors mb-4 border border-emerald-100">
          {iconMap[specialization.iconName] || <Stethoscope className="w-5 h-5 text-emerald-700" />}
        </div>

        <h3 className="text-base font-semibold text-slate-900 group-hover:text-emerald-950 transition-colors">
          {specialization.name}
        </h3>

        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
          {specialization.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 group-hover:text-emerald-900 font-medium">
        <span>{specialization.doctorCount} Doctors available</span>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
      </div>
    </button>
  );
};
