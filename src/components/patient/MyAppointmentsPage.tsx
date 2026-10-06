import React, { useState, useEffect } from 'react';
import { Appointment, TimeSlot } from '../../types';
import { hospitalService } from '../../services/hospitalService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { AppointmentCard } from '../common/AppointmentCard';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { EmptyState } from '../ui/EmptyState';
import { TableRowSkeleton } from '../ui/Skeletons';
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  Plus,
  Filter,
  CheckCircle2,
  FileText,
} from 'lucide-react';

interface MyAppointmentsPageProps {
  navigate: (route: string) => void;
}

export const MyAppointmentsPage: React.FC<MyAppointmentsPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal states
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);

  // Cancel form
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  // Reschedule form
  const [newDate, setNewDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedNewSlot, setSelectedNewSlot] = useState<TimeSlot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await hospitalService.getMyAppointments(user?.id || 'PAT1042');
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [user]);

  // Handle Cancel
  const handleConfirmCancel = async () => {
    if (!selectedAppointment) return;
    setIsCancelling(true);
    try {
      await hospitalService.cancelAppointment(selectedAppointment.id, cancelReason);
      showToast({
        type: 'info',
        title: 'Appointment Cancelled',
        message: `Appointment #${selectedAppointment.id} has been marked cancelled.`,
        mockEmailNotice: true,
      });
      setIsCancelOpen(false);
      setCancelReason('');
      loadAppointments();
    } catch (err: any) {
      showToast({ type: 'error', title: 'Cancellation Failed', message: err.message });
    } finally {
      setIsCancelling(false);
    }
  };

  // Open reschedule modal & setup default date
  const handleOpenReschedule = (app: Appointment) => {
    setSelectedAppointment(app);
    // Suggest 3 days later
    const d = new Date();
    d.setDate(d.getDate() + 3);
    const dateStr = d.toISOString().split('T')[0];
    setNewDate(dateStr);
    setIsRescheduleOpen(true);
    setRescheduleError(null);
    setSelectedNewSlot(null);

    // Fetch slots
    setLoadingSlots(true);
    hospitalService.getAvailableSlots(app.doctorId, dateStr).then((slots) => {
      setAvailableSlots(slots);
      setLoadingSlots(false);
    });
  };

  // Change date inside reschedule modal
  const handleRescheduleDateChange = async (dateStr: string) => {
    if (!selectedAppointment) return;
    setNewDate(dateStr);
    setSelectedNewSlot(null);
    setLoadingSlots(true);
    setRescheduleError(null);
    try {
      const slots = await hospitalService.getAvailableSlots(selectedAppointment.doctorId, dateStr);
      setAvailableSlots(slots);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Confirm Reschedule
  const handleConfirmReschedule = async () => {
    if (!selectedAppointment || !selectedNewSlot || !newDate) return;
    setIsRescheduling(true);
    setRescheduleError(null);
    try {
      await hospitalService.rescheduleAppointment(
        selectedAppointment.id,
        newDate,
        selectedNewSlot.time,
        selectedNewSlot.endTime24
      );
      showToast({
        type: 'success',
        title: 'Appointment Rescheduled',
        message: `Updated to ${newDate} at ${selectedNewSlot.time}. Confirmation sent.`,
        mockEmailNotice: true,
      });
      setIsRescheduleOpen(false);
      loadAppointments();
    } catch (err: any) {
      setRescheduleError(err.message || 'This time is no longer available. Please choose another slot.');
    } finally {
      setIsRescheduling(false);
    }
  };

  // Filtered
  const filtered = appointments.filter((app) => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'pending'
  );
  const nextAppointment = upcomingAppointments[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Patient Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-0.5">
            Hello, {user?.name.split(' ')[0] || 'Rahul'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your consultations, upcoming clinical visits, and booking records.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate('/appointments/book')}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Book New Consultation
        </Button>
      </div>

      {/* Hero Upcoming Appointment Banner (if any) */}
      {nextAppointment && (
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-emerald-800/80">
            <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Upcoming Priority Visit
            </span>
            <span className="text-xs font-mono text-emerald-200/80">
              #{nextAppointment.id}
            </span>
          </div>

          <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold">{nextAppointment.doctorName}</h2>
              <p className="text-sm text-emerald-200">{nextAppointment.specializationName}</p>
              <p className="text-xs text-emerald-300/80 mt-1 max-w-md">
                Reason: {nextAppointment.reasonForVisit}
              </p>
            </div>

            <div className="bg-emerald-900/60 border border-emerald-700/50 rounded-2xl p-4 sm:text-right shrink-0">
              <div className="flex sm:justify-end items-center gap-2 text-sm font-semibold">
                <Calendar className="w-4 h-4 text-emerald-300" />
                <span>{nextAppointment.date}</span>
              </div>
              <div className="flex sm:justify-end items-center gap-2 text-xs text-emerald-200 mt-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="tabular-nums">{nextAppointment.startTime}</span>
              </div>
              <div className="flex sm:justify-end items-center gap-2 text-xs text-emerald-300/80 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{nextAppointment.roomNumber || 'OPD Suite 204'}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-800/80 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-emerald-300">
              Hospital Location: 42 Arera Medical Avenue, Bhopal
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedAppointment(nextAppointment);
                  setIsDetailsOpen(true);
                }}
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-800 text-white transition-colors"
              >
                View Details
              </button>
              <button
                onClick={() => handleOpenReschedule(nextAppointment)}
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                Reschedule
              </button>
              <button
                onClick={() => {
                  setSelectedAppointment(nextAppointment);
                  setIsCancelOpen(true);
                }}
                className="text-xs font-medium px-3 py-1.5 rounded-lg text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment History / List */}
      <div className="space-y-4">
        {/* Filter Bar (Interactive Buttons) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Appointment History & Records
          </h2>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/60 overflow-x-auto text-xs">
            {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all capitalize whitespace-nowrap ${
                  filterStatus === st
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* List Content */}
        {loading ? (
          <TableRowSkeleton rows={4} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No appointments found"
            description="You don't have any appointments matching this filter."
            actionLabel="Book an Appointment"
            onAction={() => navigate('/appointments/book')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((app) => (
              <AppointmentCard
                key={app.id}
                appointment={app}
                onViewDetails={(a) => {
                  setSelectedAppointment(a);
                  setIsDetailsOpen(true);
                }}
                onReschedule={handleOpenReschedule}
                onCancel={(a) => {
                  setSelectedAppointment(a);
                  setIsCancelOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODAL 1: VIEW DETAILS */}
      {selectedAppointment && (
        <Modal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          title={`Appointment #${selectedAppointment.id}`}
          description="Official outpatient booking record"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Status</span>
                <StatusBadge status={selectedAppointment.status} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Department</span>
                <span className="font-semibold text-slate-800">
                  {selectedAppointment.specializationName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Doctor</span>
                <span className="font-semibold text-slate-800">
                  {selectedAppointment.doctorName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Date & Slot</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  {selectedAppointment.date} · {selectedAppointment.startTime}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Location</span>
                <span className="font-semibold text-slate-800">
                  {selectedAppointment.roomNumber || 'OPD Suite 204'}, Nivaan Bhopal
                </span>
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
              <span className="font-semibold text-slate-700 block">Reason for Consultation:</span>
              <p className="text-slate-600">{selectedAppointment.reasonForVisit}</p>
              {selectedAppointment.notes && (
                <p className="text-slate-500 pt-1 border-t border-slate-100 mt-2">
                  <strong className="text-slate-600">Patient Notes:</strong> {selectedAppointment.notes}
                </p>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setIsDetailsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 2: CANCEL APPOINTMENT */}
      {selectedAppointment && (
        <Modal
          isOpen={isCancelOpen}
          onClose={() => setIsCancelOpen(false)}
          title="Cancel Consultation"
          description={`Are you sure you want to cancel appointment #${selectedAppointment.id}?`}
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Cancelling will release your slot for {selectedAppointment.doctorName} on{' '}
              {selectedAppointment.date}.
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Reason for cancellation (Optional)
              </label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Work commitment conflict, feeling better, travel"
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCancelOpen(false)}
                disabled={isCancelling}
              >
                Keep Appointment
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmCancel}
                isLoading={isCancelling}
              >
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 3: RESCHEDULE APPOINTMENT */}
      {selectedAppointment && (
        <Modal
          isOpen={isRescheduleOpen}
          onClose={() => setIsRescheduleOpen(false)}
          title="Reschedule Appointment"
          description={`Select a new date and open time for ${selectedAppointment.doctorName}`}
        >
          <div className="space-y-4">
            {rescheduleError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{rescheduleError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Choose New Date
              </label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => handleRescheduleDateChange(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Select Available Slot
              </label>
              {loadingSlots ? (
                <div className="grid grid-cols-3 gap-2 py-2 animate-pulse">
                  <div className="h-8 bg-slate-100 rounded-lg" />
                  <div className="h-8 bg-slate-100 rounded-lg" />
                  <div className="h-8 bg-slate-100 rounded-lg" />
                </div>
              ) : availableSlots.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">
                  No slots available on this date. Try another weekday.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedNewSlot?.time === slot.time;
                    return (
                      <button
                        key={slot.time}
                        disabled={!slot.isAvailable}
                        onClick={() => setSelectedNewSlot(slot)}
                        className={`text-xs py-2 px-1 rounded-lg border text-center transition-all ${
                          !slot.isAvailable
                            ? 'bg-slate-50 text-slate-300 border-slate-100 line-through cursor-not-allowed'
                            : isSelected
                            ? 'bg-emerald-900 text-white border-emerald-950 font-semibold'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-600'
                        }`}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRescheduleOpen(false)}
                disabled={isRescheduling}
              >
                Dismiss
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!selectedNewSlot}
                onClick={handleConfirmReschedule}
                isLoading={isRescheduling}
              >
                Confirm Reschedule
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
