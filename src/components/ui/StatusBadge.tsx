import React from 'react';
import { AppointmentStatus } from '../../types';
import { CheckCircle2, Clock, XCircle, Check } from 'lucide-react';

interface StatusBadgeProps {
  status: AppointmentStatus;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showIcon = true }) => {
  const configs: Record<
    AppointmentStatus,
    { label: string; textClass: string; icon: React.ReactNode }
  > = {
    confirmed: {
      label: 'Confirmed',
      textClass: 'text-emerald-700 font-medium',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
    },
    pending: {
      label: 'Pending Review',
      textClass: 'text-amber-700 font-medium',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
    },
    completed: {
      label: 'Completed',
      textClass: 'text-slate-600 font-medium',
      icon: <Check className="w-3.5 h-3.5 text-slate-500" />,
    },
    cancelled: {
      label: 'Cancelled',
      textClass: 'text-rose-700 font-medium',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
    },
  };

  const config = configs[status] || configs.confirmed;

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${config.textClass}`}>
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
