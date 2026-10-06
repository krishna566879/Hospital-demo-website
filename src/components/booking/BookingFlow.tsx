import React, { useState, useEffect } from 'react';
import { Doctor, Specialization, TimeSlot, Appointment } from '../../types';
import { hospitalService } from '../../services/hospitalService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import { ErrorState } from '../ui/ErrorState';
import { CardSkeleton } from '../ui/Skeletons';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Search,
  MapPin,
  Sparkles,
  Zap,
} from 'lucide-react';

interface BookingFlowProps {
  initialSpecializationSlug?: string;
  initialDoctorId?: string;
  onBookingSuccess: (appointment: Appointment) => void;
  onNavigateHome: () => void;
  onNavigateMyAppointments: () => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({
  initialSpecializationSlug,
  initialDoctorId,
  onBookingSuccess,
  onNavigateHome,
  onNavigateMyAppointments,
}) => {
  const { user, patientProfile } = useAuth();
  const { showToast } = useToast();

  // Steps: 1: Specialist, 2: Doctor, 3: Date & Slot, 4: Patient Details, 5: Summary, 6: Success
  const [step, setStep] = useState<number>(1);

  // Selections
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState<Specialization | null>(null);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const [availableDates, setAvailableDates] = useState<{ dateStr: string; displayDay: string; displayNum: string; dayName: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Patient Form
  const [formData, setFormData] = useState({
    fullName: patientProfile?.fullName || user?.name || '',
    email: patientProfile?.email || user?.email || '',
    phone: patientProfile?.phone || user?.phone || '+91 98260 12345',
    dob: patientProfile?.dateOfBirth || '1990-01-01',
    reasonForVisit: '',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Loading & Error States
  const [isLoadingSpecs, setIsLoadingSpecs] = useState(false);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Search filters
  const [specSearch, setSpecSearch] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');

  // Confirmed Appointment for success screen
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // 1. Load initial specializations
  useEffect(() => {
    const loadSpecs = async () => {
      setIsLoadingSpecs(true);
      try {
        const list = await hospitalService.getSpecializations();
        setSpecializations(list);

        if (initialSpecializationSlug) {
          const match = list.find((s) => s.slug === initialSpecializationSlug || s.id === initialSpecializationSlug);
          if (match) {
            setSelectedSpecialization(match);
            setStep(2);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingSpecs(false);
      }
    };
    loadSpecs();
  }, [initialSpecializationSlug]);

  // 2. Load doctors when specialization changes
  useEffect(() => {
    if (!selectedSpecialization) return;

    const loadDocs = async () => {
      setIsLoadingDoctors(true);
      try {
        const list = await hospitalService.getDoctors(selectedSpecialization.id);
        setDoctors(list);

        if (initialDoctorId) {
          const match = list.find((d) => d.id === initialDoctorId);
          if (match) {
            setSelectedDoctor(match);
            setStep(3);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingDoctors(false);
      }
    };
    loadDocs();
  }, [selectedSpecialization, initialDoctorId]);

  // 3. Generate 7 available future dates when doctor is selected
  useEffect(() => {
    if (!selectedDoctor) return;

    // Generate upcoming dates starting from tomorrow or day after
    const dates = [];
    const baseDate = new Date(); // Today is 2026-10-05 according to prompt metadata, but we compute upcoming 7 days
    baseDate.setDate(baseDate.getDate() + 1); // Start from tomorrow

    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);

      const dayOfWeek = d.getDay();
      // Only include days the doctor is working
      if (selectedDoctor.workingDays.includes(dayOfWeek)) {
        const dateStr = d.toISOString().split('T')[0];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        dates.push({
          dateStr,
          displayDay: dayNames[dayOfWeek],
          displayNum: `${d.getDate()} ${monthNames[d.getMonth()]}`,
          dayName: dayNames[dayOfWeek],
        });
      }
    }

    setAvailableDates(dates);
    if (dates.length > 0) {
      setSelectedDate(dates[0].dateStr);
    }
  }, [selectedDoctor]);

  // 4. Fetch available slots when doctor and date are chosen
  useEffect(() => {
    if (!selectedDoctor || !selectedDate) return;

    const loadSlots = async () => {
      setIsLoadingSlots(true);
      setBookingError(null);
      setSelectedSlot(null);
      try {
        const fetchedSlots = await hospitalService.getAvailableSlots(selectedDoctor.id, selectedDate);
        setSlots(fetchedSlots);
      } catch (err) {
        console.error(err);
        setBookingError("Couldn't retrieve time slots for this date. Please try another day.");
      } finally {
        setIsLoadingSlots(false);
      }
    };
    loadSlots();
  }, [selectedDoctor, selectedDate]);

  // Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Valid email is required';
    if (!formData.phone.trim() || formData.phone.length < 8) errors.phone = 'Valid phone number is required';
    if (!formData.reasonForVisit.trim()) errors.reasonForVisit = 'Please describe the reason for your visit';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePatientFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep(5); // Go to summary
    }
  };

  // Confirm booking
  const handleConfirmBooking = async () => {
    if (!selectedDoctor || !selectedSpecialization || !selectedDate || !selectedSlot) return;

    setIsSubmitting(true);
    setBookingError(null);

    try {
      const created = await hospitalService.createAppointment({
        specializationId: selectedSpecialization.id,
        doctorId: selectedDoctor.id,
        date: selectedDate,
        startTime: selectedSlot.time,
        endTime: selectedSlot.endTime24,
        patientName: formData.fullName,
        patientEmail: formData.email,
        patientPhone: formData.phone,
        patientDob: formData.dob,
        reasonForVisit: formData.reasonForVisit,
        notes: formData.notes,
      });

      setConfirmedAppointment(created);
      setStep(6); // Success
      onBookingSuccess(created);

      showToast({
        type: 'success',
        title: 'Appointment Confirmed',
        message: `Your booking #${created.id} with ${created.doctorName} has been secured.`,
        mockEmailNotice: true,
      });
    } catch (err: any) {
      console.error(err);
      // Graceful error display matching requirement:
      // "When a slot is unavailable because it has just been booked, show:
      // 'This time is no longer available. Please choose another slot.'"
      const message = err.message || 'This time is no longer available. Please choose another slot.';
      setBookingError(message);

      // Refresh slots
      if (selectedDoctor && selectedDate) {
        hospitalService.getAvailableSlots(selectedDoctor.id, selectedDate).then(setSlots);
      }
      // Step back to slot picking
      setStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to trigger slot collision race condition test
  const triggerRaceConditionTest = () => {
    hospitalService.setSimulateSlotConflict(true);
    showToast({
      type: 'info',
      title: 'Conflict Mode Activated',
      message: 'Next confirmation attempt will simulate a race condition where another user booked the slot first.',
    });
  };

  const filteredSpecs = specializations.filter((s) =>
    s.name.toLowerCase().includes(specSearch.toLowerCase()) ||
    s.description.toLowerCase().includes(specSearch.toLowerCase())
  );

  const filteredDoctors = doctors.filter((d) =>
    d.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
    d.title.toLowerCase().includes(doctorSearch.toLowerCase()) ||
    d.languages.some((l) => l.toLowerCase().includes(doctorSearch.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Stepper Header (Only for steps 1-5) */}
      {step <= 5 && (
        <div className="mb-8">
          {/* Breadcrumb Stepper */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className={step >= 1 ? 'font-semibold text-emerald-900' : 'text-slate-400'}>
                01 Specialist
              </span>
              <span className="text-slate-300">/</span>
              <span className={step >= 2 ? 'font-semibold text-emerald-900' : 'text-slate-400'}>
                02 Doctor
              </span>
              <span className="text-slate-300">/</span>
              <span className={step >= 3 ? 'font-semibold text-emerald-900' : 'text-slate-400'}>
                03 Date & Time
              </span>
              <span className="text-slate-300">/</span>
              <span className={step >= 4 ? 'font-semibold text-emerald-900' : 'text-slate-400'}>
                04 Patient Details
              </span>
              <span className="text-slate-300">/</span>
              <span className={step >= 5 ? 'font-semibold text-emerald-900' : 'text-slate-400'}>
                05 Summary
              </span>
            </div>

            {/* Simulation Helper Button for Prompt's Edge Case Testing */}
            <button
              onClick={triggerRaceConditionTest}
              className="text-[11px] font-medium text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-md border border-amber-200 flex items-center gap-1 transition-colors"
              title="Test edge case: simulate that another user simultaneously booked this slot"
            >
              <Zap className="w-3 h-3 text-amber-600" />
              <span>Simulate Slot Collision</span>
            </button>
          </div>

          {/* Heading */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                {step === 1 && 'Find the right specialist for your care.'}
                {step === 2 && `Choose a Doctor · ${selectedSpecialization?.name}`}
                {step === 3 && `Select Date & Available Time Slot`}
                {step === 4 && 'Patient Information'}
                {step === 5 && 'Review and Confirm Appointment'}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {step === 1 && 'Select a clinical specialty to view doctors with open appointments.'}
                {step === 2 && 'Review credentials, experience, and availability to select your physician.'}
                {step === 3 && 'Choose an available outpatient time that works best for your schedule.'}
                {step === 4 && 'Provide patient contact details for your confirmation record.'}
                {step === 5 && 'Double check your visit details before finalizing your booking.'}
              </p>
            </div>

            {step > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep(step - 1)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                className="text-slate-600"
              >
                Back
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Global Booking Error Banner */}
      {bookingError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <p className="font-semibold">{bookingError}</p>
            <p className="text-xs text-rose-700 mt-0.5">
              Available slots have been refreshed below. Please choose another time.
            </p>
          </div>
        </div>
      )}

      {/* STEP 1: SPECIALIST SELECTION */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search specialty (e.g. Cardiology, Orthopedics)..."
              value={specSearch}
              onChange={(e) => setSpecSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
            />
          </div>

          {isLoadingSpecs ? (
            <CardSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredSpecs.map((spec) => (
                <button
                  key={spec.id}
                  onClick={() => {
                    setSelectedSpecialization(spec);
                    setStep(2);
                  }}
                  className="p-5 text-left bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-600/70 hover:shadow-md transition-all duration-150 flex flex-col justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-semibold text-sm mb-3 group-hover:bg-emerald-100 transition-colors">
                      {spec.name.slice(0, 2).toUpperCase()}
                    </div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-emerald-950 text-base">
                      {spec.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {spec.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-800 font-medium">
                    <span>{spec.doctorCount} Doctors</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP 2: DOCTOR SELECTION */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search doctors by name or language..."
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="text-xs text-slate-500">
              Showing {filteredDoctors.length} available specialists
            </div>
          </div>

          {isLoadingDoctors ? (
            <CardSkeleton count={4} />
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
              <p className="text-base font-semibold text-slate-800">No doctors found</p>
              <p className="text-xs text-slate-500 mt-1">Try choosing another specialist or clearing your search filter.</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => setStep(1)}>
                Choose Another Specialty
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 hover:border-emerald-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <img
                          src={doc.photoUrl}
                          alt={doc.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 text-base">{doc.name}</h3>
                        <p className="text-xs text-emerald-800 font-medium">{doc.title}</p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                          <span>{doc.experienceYears} yrs experience</span>
                          <span>·</span>
                          <span>{doc.languages.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                      {doc.bio}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Next Available</span>
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {doc.nextAvailability}
                      </span>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setSelectedDoctor(doc);
                        setStep(3);
                      }}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      View Available Times
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP 3: DATE & TIME SLOT PICKER */}
      {step === 3 && selectedDoctor && (
        <div className="space-y-8 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8">
          {/* Doctor Header summary */}
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
              <img
                src={selectedDoctor.photoUrl}
                alt={selectedDoctor.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{selectedDoctor.name}</h3>
              <p className="text-xs text-emerald-800">{selectedDoctor.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Consultation Fee: <span className="font-semibold text-slate-800 tabular-nums">₹{selectedDoctor.consultationFee}</span>
              </p>
            </div>
          </div>

          {/* Date Selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-3">
              1. Select Appointment Date
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
              {availableDates.map((d) => {
                const isSelected = selectedDate === d.dateStr;
                return (
                  <button
                    key={d.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(d.dateStr)}
                    className={`p-3 rounded-xl text-center border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                      isSelected
                        ? 'bg-emerald-900 text-white border-emerald-950 shadow-xs'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="block text-xs uppercase opacity-80">{d.dayName}</span>
                    <span className="block text-sm font-semibold mt-1 tabular-nums">{d.displayNum}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slot Picker */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                2. Available Time Slots for {selectedDate}
              </label>
              <span className="text-xs text-slate-400">
                {slots.filter((s) => s.isAvailable).length} open slots
              </span>
            </div>

            {isLoadingSlots ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 py-4 animate-pulse">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-10 bg-slate-100 rounded-xl" />
                ))}
              </div>
            ) : slots.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-slate-700">No available appointments</p>
                <p className="text-xs text-slate-500 mt-1">
                  There are currently no available times for this doctor on this day. Please select another date.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {slots.map((slot) => {
                  const isSelected = selectedSlot?.time === slot.time;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-medium transition-all text-center border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                        !slot.isAvailable
                          ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-emerald-900 text-white border-emerald-950 font-semibold shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50'
                      }`}
                    >
                      <span className="tabular-nums">{slot.time}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {selectedSlot ? (
                <span>
                  Selected: <strong className="text-slate-900">{selectedDate}</strong> at{' '}
                  <strong className="text-slate-900">{selectedSlot.time}</strong>
                </span>
              ) : (
                'Please pick an open time slot to proceed'
              )}
            </span>

            <Button
              variant="primary"
              disabled={!selectedSlot}
              onClick={() => setStep(4)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Details
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: PATIENT FORM */}
      {step === 4 && (
        <form onSubmit={handlePatientFormSubmit} className="space-y-6 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Patient Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 ${
                  formErrors.fullName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
                placeholder="e.g. Rahul Sharma"
              />
              {formErrors.fullName && <p className="text-[11px] text-rose-600 mt-1">{formErrors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Email Address * (For Confirmation & Receipts)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 ${
                  formErrors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
                placeholder="e.g. rahul.sharma@example.com"
              />
              {formErrors.email && <p className="text-[11px] text-rose-600 mt-1">{formErrors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 ${
                  formErrors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
                placeholder="e.g. +91 98260 12345"
              />
              {formErrors.phone && <p className="text-[11px] text-rose-600 mt-1">{formErrors.phone}</p>}
            </div>

            {/* DOB */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* Reason for Visit */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Reason for Visit *
            </label>
            <textarea
              rows={2}
              value={formData.reasonForVisit}
              onChange={(e) => setFormData({ ...formData, reasonForVisit: e.target.value })}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 ${
                formErrors.reasonForVisit ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
              placeholder="e.g. Periodic cardiac consultation, recent symptoms, or routine wellness review"
            />
            {formErrors.reasonForVisit && (
              <p className="text-[11px] text-rose-600 mt-1">{formErrors.reasonForVisit}</p>
            )}
          </div>

          {/* Optional Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Additional Notes or Previous Reports (Optional)
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              placeholder="e.g. Need wheelchair assistance or bringing 2025 lab tests"
            />
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <Button variant="ghost" size="sm" type="button" onClick={() => setStep(3)}>
              Back to Slots
            </Button>
            <Button variant="primary" type="submit" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Review Booking Summary
            </Button>
          </div>
        </form>
      )}

      {/* STEP 5: SUMMARY & CONFIRMATION */}
      {step === 5 && selectedDoctor && selectedSpecialization && selectedSlot && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-5">
            <h2 className="text-lg font-semibold text-slate-900">Appointment Summary</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Please verify all consultation details before confirming.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Consultation details */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Doctor & Department
              </span>
              <div>
                <h4 className="font-semibold text-slate-900 text-base">{selectedDoctor.name}</h4>
                <p className="text-xs text-emerald-800 font-medium">{selectedSpecialization.name}</p>
                <p className="text-xs text-slate-500 mt-1">{selectedDoctor.qualification}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500">Scheduled Date & Time</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  {selectedDate} · {selectedSlot.time}
                </span>
              </div>
            </div>

            {/* Patient details */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Patient Information
              </span>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">{formData.fullName}</h4>
                <p className="text-xs text-slate-600">{formData.email}</p>
                <p className="text-xs text-slate-600">{formData.phone}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-600">
                <p>
                  <strong className="text-slate-700">Reason:</strong> {formData.reasonForVisit}
                </p>
                {formData.notes && (
                  <p className="mt-1 text-slate-500">
                    <strong className="text-slate-700">Notes:</strong> {formData.notes}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location info */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3 text-xs text-slate-700">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">Hospital Consultation Location</p>
              <p className="text-slate-600 mt-0.5">
                Nivaan Multispeciality Hospital, 42 Arera Medical Avenue, Arera Colony, Bhopal, MP 462016 (OPD Wing).
              </p>
            </div>
          </div>

          {/* Confirm Actions */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setStep(4)} disabled={isSubmitting}>
              Edit Details
            </Button>

            <Button
              variant="primary"
              size="lg"
              onClick={handleConfirmBooking}
              isLoading={isSubmitting}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Confirm Appointment
            </Button>
          </div>
        </div>
      )}

      {/* STEP 6: SUCCESS CONFIRMATION SCREEN */}
      {step === 6 && confirmedAppointment && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Your appointment is confirmed.</h2>
            <p className="text-sm text-slate-600 mt-1">
              A digital confirmation record has been generated and sent to {confirmedAppointment.patientEmail}.
            </p>
          </div>

          {/* Ticket Card */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-left space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Appointment ID
              </span>
              <span className="text-sm font-mono font-bold text-emerald-800">
                #{confirmedAppointment.id}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Specialist</span>
                <span className="font-semibold text-slate-800 text-sm">{confirmedAppointment.doctorName}</span>
                <span className="text-slate-500 block">{confirmedAppointment.specializationName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Date & Time</span>
                <span className="font-semibold text-slate-800 text-sm">{confirmedAppointment.date}</span>
                <span className="text-slate-500 block tabular-nums">{confirmedAppointment.startTime}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-start gap-2 text-xs text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>{confirmedAppointment.roomNumber || 'OPD Suite'}, Nivaan Hospital, Arera Colony, Bhopal</span>
            </div>
          </div>

          {/* Mock notification note */}
          <div className="text-xs text-slate-500 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Digital Appointment Card ready. Please arrive 15 minutes before your time.</span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              onClick={onNavigateMyAppointments}
              className="w-full sm:w-auto"
            >
              View My Appointments
            </Button>
            <Button
              variant="outline"
              onClick={onNavigateHome}
              className="w-full sm:w-auto"
            >
              Back to Home
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
