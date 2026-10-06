import {
  Appointment,
  Doctor,
  Specialization,
  TimeSlot,
  BookingRequestInput,
  AdminNotification,
  AdminStats,
  AppointmentStatus,
} from '../types';
import {
  INITIAL_SPECIALIZATIONS,
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

// Local storage keys for persisting throughout the prototype session
const STORAGE_APPOINTMENTS_KEY = 'nivaan_hospital_appointments_v1';
const STORAGE_NOTIFICATIONS_KEY = 'nivaan_hospital_notifications_v1';
const STORAGE_DOCTORS_KEY = 'nivaan_hospital_doctors_v1';

// Helper to delay simulation
const simulateLatency = (ms: number = 200): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

class HospitalService {
  private appointments: Appointment[];
  private notifications: AdminNotification[];
  private doctors: Doctor[];
  private specializations: Specialization[];
  private forceSimulateSlotConflict: boolean = false;

  constructor() {
    this.specializations = [...INITIAL_SPECIALIZATIONS];
    
    // Load from localStorage or defaults
    const savedAppointments = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_APPOINTMENTS_KEY) : null;
    this.appointments = savedAppointments ? JSON.parse(savedAppointments) : [...INITIAL_APPOINTMENTS];

    const savedNotifications = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_NOTIFICATIONS_KEY) : null;
    this.notifications = savedNotifications ? JSON.parse(savedNotifications) : [...INITIAL_NOTIFICATIONS];

    const savedDoctors = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_DOCTORS_KEY) : null;
    this.doctors = savedDoctors ? JSON.parse(savedDoctors) : [...INITIAL_DOCTORS];
  }

  private saveState() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_APPOINTMENTS_KEY, JSON.stringify(this.appointments));
      localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(this.notifications));
      localStorage.setItem(STORAGE_DOCTORS_KEY, JSON.stringify(this.doctors));
    }
  }

  public setSimulateSlotConflict(enable: boolean) {
    this.forceSimulateSlotConflict = enable;
  }

  public getSimulateSlotConflict(): boolean {
    return this.forceSimulateSlotConflict;
  }

  // --- SPECIALIZATIONS ---
  async getSpecializations(): Promise<Specialization[]> {
    await simulateLatency(120);
    return [...this.specializations];
  }

  async getSpecializationBySlug(slug: string): Promise<Specialization | null> {
    await simulateLatency(100);
    return this.specializations.find((s) => s.slug === slug || s.id === slug) || null;
  }

  // --- DOCTORS ---
  async getDoctors(specializationId?: string, query?: string): Promise<Doctor[]> {
    await simulateLatency(160);
    let results = [...this.doctors];

    if (specializationId && specializationId !== 'all') {
      results = results.filter((doc) => doc.specializationId === specializationId);
    }

    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      results = results.filter(
        (doc) =>
          doc.name.toLowerCase().includes(q) ||
          doc.specializationName.toLowerCase().includes(q) ||
          doc.bio.toLowerCase().includes(q) ||
          doc.languages.some((l) => l.toLowerCase().includes(q))
      );
    }

    return results;
  }

  async getDoctorById(id: string): Promise<Doctor | null> {
    await simulateLatency(120);
    return this.doctors.find((d) => d.id === id) || null;
  }

  async updateDoctorSchedule(doctorId: string, workingDays: number[], hours: { start: string; end: string }, slotDurationMinutes: number): Promise<Doctor> {
    await simulateLatency(250);
    const index = this.doctors.findIndex((d) => d.id === doctorId);
    if (index === -1) throw new Error('Doctor not found');

    const updated = {
      ...this.doctors[index],
      workingDays,
      availableHours: hours,
      slotDurationMinutes,
    };
    this.doctors[index] = updated;

    // Log notification
    this.notifications.unshift({
      id: `NOTIF${Date.now()}`,
      type: 'schedule_updated',
      title: 'Doctor Schedule Updated',
      message: `${updated.name}'s clinic schedule was updated.`,
      timestamp: 'Just now',
      isRead: false,
      doctorName: updated.name,
    });

    this.saveState();
    return updated;
  }

  // --- SLOTS & AVAILABILITY ---
  async getDoctorAvailability(doctorId: string): Promise<{ workingDays: number[]; hours: { start: string; end: string } }> {
    await simulateLatency(100);
    const doc = this.doctors.find((d) => d.id === doctorId);
    if (!doc) throw new Error('Doctor not found');
    return {
      workingDays: doc.workingDays,
      hours: doc.availableHours,
    };
  }

  async getAvailableSlots(doctorId: string, date: string): Promise<TimeSlot[]> {
    await simulateLatency(200);
    const doctor = this.doctors.find((d) => d.id === doctorId);
    if (!doctor) throw new Error('Doctor not found');

    // Parse day of week (0 is Sunday, 6 is Saturday)
    const targetDate = new Date(`${date}T00:00:00`);
    const dayOfWeek = targetDate.getDay();

    // Check if doctor works on this day
    if (!doctor.workingDays.includes(dayOfWeek)) {
      return []; // Doctor off on this day
    }

    // Generate slots based on doctor's available hours
    // Example: 09:00 to 16:00 in 30 min intervals, with a lunch break 13:00 - 14:00
    const [startH, startM] = doctor.availableHours.start.split(':').map(Number);
    const [endH, endM] = doctor.availableHours.end.split(':').map(Number);

    const startTotalMinutes = startH * 60 + startM;
    const endTotalMinutes = endH * 60 + endM;
    const duration = doctor.slotDurationMinutes || 30;

    // Get all existing active appointments for this doctor on this date
    const bookedTimes = this.appointments
      .filter((app) => app.doctorId === doctorId && app.date === date && app.status !== 'cancelled')
      .map((app) => app.startTime);

    const slots: TimeSlot[] = [];

    for (let current = startTotalMinutes; current + duration <= endTotalMinutes; current += duration) {
      // Simulate standard 1:00 PM to 2:00 PM doctor lunch/break
      if (current >= 13 * 60 && current < 14 * 60) {
        continue;
      }

      const h = Math.floor(current / 60);
      const m = current % 60;
      const endTotal = current + duration;
      const endHour = Math.floor(endTotal / 60);
      const endMinute = endTotal % 60;

      const format24 = (hh: number, mm: number) =>
        `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;

      const format12 = (hh: number, mm: number) => {
        const period = hh >= 12 ? 'PM' : 'AM';
        const displayH = hh % 12 === 0 ? 12 : hh % 12;
        return `${displayH.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')} ${period}`;
      };

      const time12 = format12(h, m);
      const startTime24 = format24(h, m);
      const endTime24 = format24(endHour, endMinute);

      const isBooked = bookedTimes.includes(time12) || bookedTimes.includes(startTime24);

      slots.push({
        time: time12,
        startTime24,
        endTime24,
        isAvailable: !isBooked,
        isBooked,
      });
    }

    return slots;
  }

  // --- APPOINTMENTS ---
  async createAppointment(input: BookingRequestInput): Promise<Appointment> {
    await simulateLatency(300);

    // 1. Edge Case Simulation: If artificial conflict flag is turned on or slot is booked
    if (this.forceSimulateSlotConflict) {
      this.forceSimulateSlotConflict = false; // Reset after one trigger
      throw new Error('This time is no longer available. Please choose another slot.');
    }

    // 2. Real check: is slot already taken?
    const existing = this.appointments.find(
      (app) =>
        app.doctorId === input.doctorId &&
        app.date === input.date &&
        (app.startTime === input.startTime || app.startTime === input.startTime.replace(/^0/, '')) &&
        app.status !== 'cancelled'
    );

    if (existing) {
      throw new Error('This time is no longer available. Please choose another slot.');
    }

    const doctor = this.doctors.find((d) => d.id === input.doctorId);
    const spec = this.specializations.find((s) => s.id === input.specializationId);

    const newAppointmentId = `NV${Math.floor(10300 + Math.random() * 8900)}`;

    const newAppointment: Appointment = {
      id: newAppointmentId,
      patientId: 'PAT1042', // Current active demo patient
      patientName: input.patientName,
      patientEmail: input.patientEmail,
      patientPhone: input.patientPhone,
      patientDob: input.patientDob,
      doctorId: input.doctorId,
      doctorName: doctor ? doctor.name : 'Consultant',
      specializationId: input.specializationId,
      specializationName: spec ? spec.name : 'Specialist Consultation',
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      reasonForVisit: input.reasonForVisit,
      notes: input.notes,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      roomNumber: `OPD Suite ${Math.floor(100 + Math.random() * 300)}`,
    };

    this.appointments.unshift(newAppointment);

    // Create Admin notification
    const newNotification: AdminNotification = {
      id: `NOTIF${Date.now()}`,
      type: 'appointment_created',
      title: 'New Appointment Booked',
      message: `${input.patientName} booked with ${doctor?.name || 'Doctor'} on ${input.date} at ${input.startTime}.`,
      timestamp: 'Just now',
      isRead: false,
      appointmentId: newAppointment.id,
      patientName: input.patientName,
      doctorName: doctor?.name,
    };
    this.notifications.unshift(newNotification);

    this.saveState();
    return newAppointment;
  }

  async getMyAppointments(patientId: string = 'PAT1042'): Promise<Appointment[]> {
    await simulateLatency(180);
    return this.appointments.filter((app) => app.patientId === patientId || app.patientEmail === 'rahul.sharma@example.com');
  }

  async cancelAppointment(appointmentId: string, reason?: string): Promise<Appointment> {
    await simulateLatency(250);
    const index = this.appointments.findIndex((a) => a.id === appointmentId);
    if (index === -1) throw new Error('Appointment not found');

    const app = this.appointments[index];
    const updated: Appointment = {
      ...app,
      status: 'cancelled',
      cancelReason: reason || 'Cancelled by patient',
    };
    this.appointments[index] = updated;

    this.notifications.unshift({
      id: `NOTIF${Date.now()}`,
      type: 'appointment_cancelled',
      title: 'Appointment Cancelled',
      message: `Appointment #${appointmentId} for ${app.patientName} was cancelled.`,
      timestamp: 'Just now',
      isRead: false,
      appointmentId: appointmentId,
      patientName: app.patientName,
      doctorName: app.doctorName,
    });

    this.saveState();
    return updated;
  }

  async rescheduleAppointment(appointmentId: string, newDate: string, newTime: string, newEndTime: string): Promise<Appointment> {
    await simulateLatency(280);
    const index = this.appointments.findIndex((a) => a.id === appointmentId);
    if (index === -1) throw new Error('Appointment not found');

    const app = this.appointments[index];
    // Check collision
    const conflict = this.appointments.find(
      (a) => a.id !== appointmentId && a.doctorId === app.doctorId && a.date === newDate && a.startTime === newTime && a.status !== 'cancelled'
    );
    if (conflict) {
      throw new Error('This time is no longer available. Please choose another slot.');
    }

    const updated: Appointment = {
      ...app,
      date: newDate,
      startTime: newTime,
      endTime: newEndTime,
      status: 'confirmed',
    };
    this.appointments[index] = updated;

    this.notifications.unshift({
      id: `NOTIF${Date.now()}`,
      type: 'appointment_rescheduled',
      title: 'Appointment Rescheduled',
      message: `${app.patientName} rescheduled appointment #${appointmentId} to ${newDate} at ${newTime}.`,
      timestamp: 'Just now',
      isRead: false,
      appointmentId: appointmentId,
      patientName: app.patientName,
      doctorName: app.doctorName,
    });

    this.saveState();
    return updated;
  }

  // --- ADMIN PORTAL ---
  async getAdminAppointments(filters?: { status?: string; doctorId?: string; date?: string; search?: string }): Promise<Appointment[]> {
    await simulateLatency(200);
    let results = [...this.appointments];

    if (filters?.status && filters.status !== 'all') {
      results = results.filter((a) => a.status === filters.status);
    }
    if (filters?.doctorId && filters.doctorId !== 'all') {
      results = results.filter((a) => a.doctorId === filters.doctorId);
    }
    if (filters?.date) {
      results = results.filter((a) => a.date === filters.date);
    }
    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      results = results.filter(
        (a) =>
          a.patientName.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q) ||
          a.doctorName.toLowerCase().includes(q) ||
          a.patientPhone.includes(q)
      );
    }

    return results;
  }

  async updateAppointmentStatus(appointmentId: string, status: AppointmentStatus): Promise<Appointment> {
    await simulateLatency(200);
    const index = this.appointments.findIndex((a) => a.id === appointmentId);
    if (index === -1) throw new Error('Appointment not found');

    this.appointments[index] = {
      ...this.appointments[index],
      status,
    };
    this.saveState();
    return this.appointments[index];
  }

  async getAdminStats(): Promise<AdminStats> {
    await simulateLatency(150);
    const todayStr = '2026-10-12'; // Aligned with the prototype timeline
    const todayAppointments = this.appointments.filter((a) => a.date === todayStr);

    return {
      todayAppointmentsCount: todayAppointments.length > 0 ? todayAppointments.length : 24,
      pendingCount: this.appointments.filter((a) => a.status === 'pending').length,
      confirmedCount: this.appointments.filter((a) => a.status === 'confirmed').length,
      totalPatientsCount: 1284 + this.appointments.length,
      activeDoctorsCount: this.doctors.length,
      completedThisWeek: 42,
    };
  }

  async getAdminNotifications(): Promise<AdminNotification[]> {
    await simulateLatency(120);
    return [...this.notifications];
  }

  async markNotificationRead(id: string): Promise<void> {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.saveState();
    }
  }

  async markAllNotificationsRead(): Promise<void> {
    this.notifications.forEach((n) => (n.isRead = true));
    this.saveState();
  }

  // Reset to factory defaults for testing
  resetPrototypeData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_APPOINTMENTS_KEY);
      localStorage.removeItem(STORAGE_NOTIFICATIONS_KEY);
      localStorage.removeItem(STORAGE_DOCTORS_KEY);
    }
    this.appointments = [...INITIAL_APPOINTMENTS];
    this.notifications = [...INITIAL_NOTIFICATIONS];
    this.doctors = [...INITIAL_DOCTORS];
    this.specializations = [...INITIAL_SPECIALIZATIONS];
  }
}

export const hospitalService = new HospitalService();
