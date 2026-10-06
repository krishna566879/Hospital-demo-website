import React from 'react';
import { Appointment } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { Calendar, Clock, MapPin, AlertCircle, FileText } from 'lucide-react';

interface AppointmentCardProps {
  appointment: Appointment;
  onViewDetails: (app: Appointment) => void;
  onReschedule?: (app: Appointment) => void;
  onCancel?: (app: Appointment) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onViewDetails,
  onReschedule,
  onCancel,
}) => {
  const isUpcoming = appointment.status === 'confirmed' || appointment.status === 'pending';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 transition-all duration-200 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold text-slate-500 tabular-nums">
              #{appointment.id}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <StatusBadge status={appointment.status} />
          </div>

          <h3 className="text-base font-semibold text-slate-900 mt-1">
            {appointment.doctorName}
          </h3>
          <p className="text-xs text-emerald-800 font-medium">
            {appointment.specializationName}
          </p>
        </div>

        {/* Date and Time block */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs sm:text-right shrink-0">
          <div className="flex sm:justify-end items-center gap-1.5 font-semibold text-slate-800">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span>{appointment.date}</span>
          </div>
          <div className="flex sm:justify-end items-center gap-1.5 text-slate-500 mt-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="tabular-nums">{appointment.startTime} - {appointment.endTime}</span>
          </div>
        </div>
      </div>

      <div className="py-3 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-slate-500">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{appointment.roomNumber || 'Main OPD Building'}</span>
        </div>

        <div className="text-slate-500 truncate max-w-xs">
          <span className="font-medium text-slate-700">Reason: </span>
          <span>{appointment.reasonForVisit}</span>
        </div>
      </div>

      {appointment.cancelReason && (
        <div className="mb-3 p-2.5 rounded-lg bg-rose-50 border border-rose-100 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Note: {appointment.cancelReason}</span>
        </div>
      )}

      {/* Card Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(appointment)}
          leftIcon={<FileText className="w-3.5 h-3.5" />}
          className="text-xs text-slate-600 hover:text-slate-900 px-2.5"
        >
          View Details
        </Button>

        {isUpcoming && (
          <div className="flex items-center gap-2">
            {onCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel(appointment)}
                className="text-xs text-rose-700 hover:bg-rose-50 border-rose-200 px-3"
              >
                Cancel
              </Button>
            )}
            {onReschedule && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onReschedule(appointment)}
                className="text-xs px-3"
              >
                Reschedule
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
