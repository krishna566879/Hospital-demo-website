import React, { useState, useEffect } from 'react';
import { Appointment, Doctor, AdminNotification, AdminStats, AppointmentStatus } from '../../types';
import { hospitalService } from '../../services/hospitalService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { TableRowSkeleton, StatsSkeleton } from '../ui/Skeletons';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Bell,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Plus,
  Sliders,
  ChevronRight,
  Shield,
  FileText,
  RotateCcw,
} from 'lucide-react';

interface AdminDashboardProps {
  currentSubTab?: string;
  navigate: (route: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentSubTab = 'overview', navigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'doctors' | 'availability' | 'notifications'>(
    (currentSubTab as any) || 'overview'
  );

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters for appointments table
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [doctorFilter, setDoctorFilter] = useState('all');

  // Modal for viewing appointment details
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null);

  // Availability Management State
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('DOC001');
  const [workingDays, setWorkingDays] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [slotDuration, setSlotDuration] = useState(30);
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [st, apps, docs, notifs] = await Promise.all([
        hospitalService.getAdminStats(),
        hospitalService.getAdminAppointments(),
        hospitalService.getDoctors(),
        hospitalService.getAdminNotifications(),
      ]);
      setStats(st);
      setAppointments(apps);
      setDoctors(docs);
      setNotifications(notifs);

      // Load initial selected doctor schedule
      const doc = docs.find((d) => d.id === selectedDoctorId) || docs[0];
      if (doc) {
        setSelectedDoctorId(doc.id);
        setWorkingDays(doc.workingDays);
        setStartTime(doc.availableHours.start);
        setEndTime(doc.availableHours.end);
        setSlotDuration(doc.slotDurationMinutes || 30);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Update status handler (Confirm, Cancel, Complete)
  const handleUpdateStatus = async (appointmentId: string, newStatus: AppointmentStatus) => {
    try {
      await hospitalService.updateAppointmentStatus(appointmentId, newStatus);
      showToast({
        type: 'success',
        title: 'Status Updated',
        message: `Appointment #${appointmentId} changed to ${newStatus}.`,
        mockEmailNotice: true,
      });
      loadAllData();
    } catch (err: any) {
      showToast({ type: 'error', title: 'Update Failed', message: err.message });
    }
  };

  // Availability doctor selection change
  const handleDoctorScheduleSelect = (docId: string) => {
    setSelectedDoctorId(docId);
    const doc = doctors.find((d) => d.id === docId);
    if (doc) {
      setWorkingDays(doc.workingDays);
      setStartTime(doc.availableHours.start);
      setEndTime(doc.availableHours.end);
      setSlotDuration(doc.slotDurationMinutes || 30);
    }
  };

  // Toggle working day
  const toggleWorkingDay = (dayIdx: number) => {
    setWorkingDays((prev) =>
      prev.includes(dayIdx) ? prev.filter((d) => d !== dayIdx) : [...prev, dayIdx].sort()
    );
  };

  // Save updated schedule
  const handleSaveSchedule = async () => {
    setIsSavingSchedule(true);
    try {
      await hospitalService.updateDoctorSchedule(
        selectedDoctorId,
        workingDays,
        { start: startTime, end: endTime },
        slotDuration
      );
      showToast({
        type: 'success',
        title: 'Schedule Synchronized',
        message: 'Clinical outpatient slots updated. New bookings will reflect these hours.',
      });
      loadAllData();
    } catch (err: any) {
      showToast({ type: 'error', title: 'Save Failed', message: err.message });
    } finally {
      setIsSavingSchedule(false);
    }
  };

  // Reset Prototype Data
  const handleResetData = () => {
    hospitalService.resetPrototypeData();
    showToast({
      type: 'info',
      title: 'Prototype Reset',
      message: 'Restored original mock appointments and default schedules.',
    });
    loadAllData();
  };

  // Mark notification read
  const handleMarkNotifRead = async (id: string) => {
    await hospitalService.markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // Filtered Appointments
  const filteredAppointments = appointments.filter((app) => {
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    if (doctorFilter !== 'all' && app.doctorId !== doctorFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        app.patientName.toLowerCase().includes(q) ||
        app.id.toLowerCase().includes(q) ||
        app.doctorName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Hospital Operations Console
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">Bhopal Main OPD Wing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Good morning, Admin
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Supabase Schema Ready: Appointments, Rosters, and Real-time Outpatient Queues.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetData}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            title="Reset prototype data to original demo state"
          >
            Reset Mock Data
          </Button>

          <button
            onClick={() => setActiveTab('notifications')}
            className="relative p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-slate-700"
            aria-label="Admin Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadNotifsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-emerald-900 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Overview & Stats
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'appointments'
              ? 'bg-emerald-900 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>Appointments Table</span>
          <span className="text-[10px] bg-slate-200/60 text-slate-800 px-1.5 py-0.2 rounded-full tabular-nums">
            {appointments.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('doctors')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'doctors'
              ? 'bg-emerald-900 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Doctor Directory
        </button>
        <button
          onClick={() => setActiveTab('availability')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'availability'
              ? 'bg-emerald-900 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Availability & Schedules</span>
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'notifications'
              ? 'bg-emerald-900 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>Notifications</span>
          {unreadNotifsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
          )}
        </button>
      </div>

      {/* TAB 1: OVERVIEW & STATS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Stat Metric Cards */}
          {loading ? (
            <StatsSkeleton />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                <span className="text-xs text-slate-500 font-medium">Today's Appointments</span>
                <p className="text-3xl font-bold text-slate-900 mt-2 tabular-nums">
                  {stats?.todayAppointmentsCount || 24}
                </p>
                <span className="text-[11px] text-emerald-800 font-medium mt-1 block">
                  +12% vs last week
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                <span className="text-xs text-slate-500 font-medium">Pending Review</span>
                <p className="text-3xl font-bold text-amber-700 mt-2 tabular-nums">
                  {stats?.pendingCount || 8}
                </p>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Awaiting staff confirmation
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                <span className="text-xs text-slate-500 font-medium">Confirmed Outpatient</span>
                <p className="text-3xl font-bold text-emerald-700 mt-2 tabular-nums">
                  {stats?.confirmedCount || 16}
                </p>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Checked in / Scheduled
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                <span className="text-xs text-slate-500 font-medium">Total Registered Patients</span>
                <p className="text-3xl font-bold text-slate-900 mt-2 tabular-nums">
                  {stats?.totalPatientsCount?.toLocaleString() || '1,284'}
                </p>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Hospital EMR records
                </span>
              </div>
            </div>
          )}

          {/* Quick Schedule Today / Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Appointments Today */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Appointments for Today (12 Oct 2026)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live patient queue for OPD Consultations
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('appointments')}
                  className="text-xs"
                >
                  View All
                </Button>
              </div>

              <div className="divide-y divide-slate-100">
                {appointments.slice(0, 4).map((app) => (
                  <div key={app.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <p className="font-semibold text-slate-900">{app.patientName}</p>
                      <p className="text-slate-500 text-[11px]">
                        {app.doctorName} · {app.specializationName}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-semibold text-slate-800 tabular-nums block">
                        {app.startTime}
                      </span>
                      <StatusBadge status={app.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Notifications / Activity Feed */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4">
              <h3 className="text-base font-semibold text-slate-900">Operational Log</h3>
              <div className="space-y-3">
                {notifications.slice(0, 4).map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <p className="font-medium text-slate-800">{n.title}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-2">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{n.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: APPOINTMENTS TABLE */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-5">
          {/* Filter & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search patient, doctor, or ID (#NV...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Doctor filter */}
              <select
                value={doctorFilter}
                onChange={(e) => setDoctorFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-700 max-w-[180px] truncate"
              >
                <option value="all">All Doctors</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <TableRowSkeleton rows={6} />
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500">
              No appointments found matching this criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
                    <th className="py-3 px-3">Appointment ID / Patient</th>
                    <th className="py-3 px-3">Consulting Doctor</th>
                    <th className="py-3 px-3">Specialty</th>
                    <th className="py-3 px-3">Date & Slot</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-3">
                        <span className="font-mono text-emerald-800 font-bold block">
                          #{app.id}
                        </span>
                        <span className="font-semibold text-slate-900 block">{app.patientName}</span>
                        <span className="text-[11px] text-slate-400">{app.patientPhone}</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-slate-800 block">{app.doctorName}</span>
                        <span className="text-[11px] text-slate-400">{app.roomNumber || 'Main OPD'}</span>
                      </td>

                      <td className="py-3.5 px-3 text-slate-600 font-medium">
                        {app.specializationName}
                      </td>

                      <td className="py-3.5 px-3 text-slate-800 tabular-nums">
                        <span className="font-medium block">{app.date}</span>
                        <span className="text-[11px] text-slate-500">{app.startTime}</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <StatusBadge status={app.status} />
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingAppointment(app)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            title="View Record"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {app.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'confirmed')}
                              className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50"
                              title="Confirm Appointment"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {app.status === 'confirmed' && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'completed')}
                              className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50"
                              title="Mark Completed"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {app.status !== 'cancelled' && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'cancelled')}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                              title="Cancel Appointment"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DOCTOR MANAGEMENT */}
      {activeTab === 'doctors' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Medical Specialists Directory</h3>
              <p className="text-xs text-slate-500">
                Manage doctor credentials, active status, and department allocation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={doc.photoUrl}
                        alt={doc.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">{doc.name}</h4>
                      <p className="text-xs text-emerald-800">{doc.title}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{doc.qualification}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                    <p>
                      <strong className="text-slate-700">Experience:</strong> {doc.experienceYears} Years
                    </p>
                    <p>
                      <strong className="text-slate-700">Hours:</strong> {doc.availableHours.start} -{' '}
                      {doc.availableHours.end} ({doc.slotDurationMinutes} min slots)
                    </p>
                    <p>
                      <strong className="text-slate-700">Fee:</strong> ₹{doc.consultationFee}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {doc.nextAvailability}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      handleDoctorScheduleSelect(doc.id);
                      setActiveTab('availability');
                    }}
                  >
                    Edit Schedule
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AVAILABILITY MANAGEMENT */}
      {activeTab === 'availability' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 max-w-3xl">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Doctor Roster & Availability Configuration
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Future Supabase Schema: `doctor_availability` and slot generation rules.
            </p>
          </div>

          <div className="space-y-5">
            {/* Choose Doctor */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Select Medical Specialist
              </label>
              <select
                value={selectedDoctorId}
                onChange={(e) => handleDoctorScheduleSelect(e.target.value)}
                className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.specializationName}
                  </option>
                ))}
              </select>
            </div>

            {/* Working Days */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Outpatient Clinic Days
              </label>
              <div className="grid grid-cols-7 gap-2">
                {[
                  { idx: 0, label: 'Sun' },
                  { idx: 1, label: 'Mon' },
                  { idx: 2, label: 'Tue' },
                  { idx: 3, label: 'Wed' },
                  { idx: 4, label: 'Thu' },
                  { idx: 5, label: 'Fri' },
                  { idx: 6, label: 'Sat' },
                ].map((day) => {
                  const active = workingDays.includes(day.idx);
                  return (
                    <button
                      key={day.idx}
                      type="button"
                      onClick={() => toggleWorkingDay(day.idx)}
                      className={`py-2 text-center text-xs font-semibold rounded-xl border transition-all ${
                        active
                          ? 'bg-emerald-900 text-white border-emerald-950'
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hours & Slot Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Shift Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Shift End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Slot Duration
                </label>
                <select
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={20}>20 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>
            </div>

            {/* Notice */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">Automatic Slot Query Engine</p>
              <p className="mt-0.5 text-slate-500">
                Saving will regenerate the bookable slots in the mock repository. Future appointments for this doctor will follow these timings.
              </p>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                variant="primary"
                onClick={handleSaveSchedule}
                isLoading={isSavingSchedule}
              >
                Save & Synchronize Schedule
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 max-w-3xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Notification Center</h3>
              <p className="text-xs text-slate-500">
                Real-time booking and scheduling alerts
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => hospitalService.markAllNotificationsRead().then(loadAllData)}
              className="text-xs"
            >
              Mark All as Read
            </Button>
          </div>

          <div className="divide-y divide-slate-100">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleMarkNotifRead(notif.id)}
                className={`py-3.5 px-3 rounded-xl flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                  !notif.isRead ? 'bg-emerald-50/50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      !notif.isRead ? 'bg-emerald-600' : 'bg-transparent'
                    }`}
                  />
                  <div>
                    <h4 className="font-semibold text-slate-900 text-xs">{notif.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      {notif.timestamp}
                    </span>
                  </div>
                </div>

                {!notif.isRead && (
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100/70 px-2 py-0.5 rounded shrink-0">
                    NEW
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: VIEW FULL APPOINTMENT RECORD */}
      {viewingAppointment && (
        <Modal
          isOpen={!!viewingAppointment}
          onClose={() => setViewingAppointment(null)}
          title={`Appointment #${viewingAppointment.id}`}
          description="Complete Patient Consultation Docket"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Status</span>
                <StatusBadge status={viewingAppointment.status} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Patient Full Name</span>
                <span className="font-semibold text-slate-800">{viewingAppointment.patientName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Phone & Email</span>
                <span className="text-slate-700">
                  {viewingAppointment.patientPhone} · {viewingAppointment.patientEmail}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Consultant</span>
                <span className="font-semibold text-slate-800">{viewingAppointment.doctorName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Slot Scheduled</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  {viewingAppointment.date} at {viewingAppointment.startTime}
                </span>
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
              <span className="font-semibold text-slate-700 block">Chief Complaint / Reason:</span>
              <p className="text-slate-600">{viewingAppointment.reasonForVisit}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setViewingAppointment(null)}>
                Dismiss
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
