export type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';

export interface Specialization {
  id: string;
  slug: string;
  name: string;
  description: string;
  doctorCount: number;
  iconName: string; // lucide icon identifier
  commonConditions: string[];
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specializationId: string;
  specializationName: string;
  experienceYears: number;
  qualification: string;
  languages: string[];
  bio: string;
  consultationFee: number;
  photoUrl: string;
  rating: number;
  reviewCount: number;
  nextAvailability: string; // e.g., "Available Today", "Tomorrow", "Wed 14 Oct"
  workingDays: number[]; // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  availableHours: {
    start: string; // "09:00"
    end: string;   // "17:00"
  };
  slotDurationMinutes: number; // 30
}

export interface TimeSlot {
  time: string; // "09:00 AM"
  startTime24: string; // "09:00"
  endTime24: string; // "09:30"
  isAvailable: boolean;
  isBooked: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientDob?: string;
  doctorId: string;
  doctorName: string;
  specializationId: string;
  specializationName: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "09:30 AM" or "09:30"
  endTime: string; // "10:00 AM"
  reasonForVisit: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
  roomNumber?: string;
  cancelReason?: string;
}

export interface PatientProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  bloodGroup: string;
  gender: string;
  address: string;
  city: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface AdminNotification {
  id: string;
  type: 'appointment_created' | 'appointment_cancelled' | 'appointment_rescheduled' | 'schedule_updated';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  appointmentId?: string;
  patientName?: string;
  doctorName?: string;
}

export interface AdminStats {
  todayAppointmentsCount: number;
  pendingCount: number;
  confirmedCount: number;
  totalPatientsCount: number;
  activeDoctorsCount: number;
  completedThisWeek: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'admin';
  phone?: string;
  avatarUrl?: string;
}

export interface BookingRequestInput {
  specializationId: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientDob: string;
  reasonForVisit: string;
  notes?: string;
}
