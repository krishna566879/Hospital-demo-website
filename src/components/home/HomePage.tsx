import React, { useState, useEffect } from 'react';
import { Doctor, Specialization } from '../../types';
import { hospitalService } from '../../services/hospitalService';
import { HOSPITAL_INFO, HOSPITAL_FACILITIES, TESTIMONIALS } from '../../data/mockData';
import { DoctorCard } from '../common/DoctorCard';
import { SpecializationCard } from '../common/SpecializationCard';
import { Button } from '../ui/Button';
import { CardSkeleton } from '../ui/Skeletons';
import {
  Calendar,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  Users,
  Building2,
  Clock,
  MapPin,
  CheckCircle,
  Stethoscope,
} from 'lucide-react';

interface HomePageProps {
  navigate: (route: string) => void;
  onSelectSpecialization: (spec: Specialization) => void;
  onBookDoctor: (doctor: Doctor) => void;
  onViewDoctorProfile: (doctor: Doctor) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  navigate,
  onSelectSpecialization,
  onBookDoctor,
  onViewDoctorProfile,
}) => {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [featuredDoctors, setFeaturedDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [specs, docs] = await Promise.all([
          hospitalService.getSpecializations(),
          hospitalService.getDoctors(),
        ]);
        setSpecializations(specs);
        // Take 4 featured doctors as requested in brief
        setFeaturedDoctors(docs.slice(0, 4));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* SECTION 1 — HERO */}
      <section className="relative pt-6 sm:pt-12 pb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-900 bg-emerald-50/80 px-3 py-1 rounded-full border border-emerald-200/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>COMPASSIONATE CARE. ADVANCED MEDICINE.</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 leading-[1.12] text-balance">
                Healthcare that puts people first.
              </h1>

              {/* Supporting Copy */}
              <p className="text-lg sm:text-xl text-slate-600 max-w-xl leading-relaxed">
                Trusted specialists, advanced facilities, and a simpler way to get the care you need.
              </p>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/appointments/book')}
                  leftIcon={<Calendar className="w-4 h-4" />}
                >
                  Book an Appointment
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/specialists')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Explore Specialists
                </Button>
              </div>

              {/* Small Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/60 flex flex-wrap items-center gap-6 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-800" />
                  <span>24/7 Emergency</span>
                </div>
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-emerald-800" />
                  <span>80+ Specialists</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-800" />
                  <span>50K+ Patients Served</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Quality Medical Photography + Floating Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-100 aspect-4/3 lg:aspect-5/6">
                <img
                  src={HOSPITAL_INFO.heroImage}
                  alt="Doctor consulting patient in modern clinic suite"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />

                {/* Subtle gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

                {/* Floating Appointment Card */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-white/40 shadow-xl space-y-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                      Need a doctor?
                    </span>
                    <h4 className="text-sm font-semibold text-slate-900 mt-0.5">
                      Find the right specialist and available appointment time.
                    </h4>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/appointments/book')}
                    className="w-full text-xs"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Find Appointment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — SPECIALIST FINDER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Find the right specialist.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-xl">
              Choose a medical specialty and explore doctors with available appointments.
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/specialists')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="text-emerald-900 font-semibold"
          >
            All Specializations
          </Button>
        </div>

        {loading ? (
          <CardSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {specializations.map((spec) => (
              <SpecializationCard
                key={spec.id}
                specialization={spec}
                onClick={() => onSelectSpecialization(spec)}
              />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 3 — WHY NIVAAN */}
      <section className="bg-emerald-950 text-emerald-50 rounded-3xl mx-4 sm:mx-6 lg:mx-8 py-16 px-6 sm:px-12 lg:px-16 overflow-hidden relative">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block mb-2">
              The Nivaan Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Why Central India trusts Nivaan for specialized care.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-800 flex items-center justify-center text-emerald-300">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Expert Specialists</h3>
              <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
                Experienced doctors across major specialties with decades of clinical excellence.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-800 flex items-center justify-center text-emerald-300">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Advanced Facilities</h3>
              <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
                Modern diagnostic and treatment infrastructure supporting precise medical decisions.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-800 flex items-center justify-center text-emerald-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Patient-First Experience</h3>
              <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
                Clear communication, transparent scheduling, and a calm, supportive clinical environment.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-800 flex items-center justify-center text-emerald-300">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">24/7 Emergency Care</h3>
              <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
                Continuous trauma and critical care support when you and your loved ones need it most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — FEATURED DOCTORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Meet our senior consultants.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Experienced medical leadership providing compassionate, evidence-based care.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/doctors')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            View All Doctors
          </Button>
        </div>

        {loading ? (
          <CardSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDoctors.map((doc) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                onBook={onBookDoctor}
                onViewProfile={onViewDoctorProfile}
              />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 5 — HOW APPOINTMENTS WORK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 block mb-2">
            Simple Booking Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            How appointments work.
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            No unnecessary calls. No complicated process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 relative space-y-4">
            <span className="text-3xl font-serif-heading font-semibold text-emerald-800/40 block">
              01
            </span>
            <h3 className="text-lg font-semibold text-slate-900">Choose a Specialist</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Explore medical departments or filter by clinical symptoms to match with the appropriate consultant.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 relative space-y-4">
            <span className="text-3xl font-serif-heading font-semibold text-emerald-800/40 block">
              02
            </span>
            <h3 className="text-lg font-semibold text-slate-900">Select an Available Time</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              View live doctor schedules and pick a precise 30-minute slot that fits your day effortlessly.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 relative space-y-4">
            <span className="text-3xl font-serif-heading font-semibold text-emerald-800/40 block">
              03
            </span>
            <h3 className="text-lg font-semibold text-slate-900">Confirm Your Appointment</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Receive your confirmed appointment reference, OPD room details, and timely digital reminders.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6 — FACILITIES (Editorial Image Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 block mb-2">
            Infrastructure & Equipment
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Modern spaces built for healing and precision.
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Engineered to meet national quality benchmarks with natural daylight and calm acoustics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOSPITAL_FACILITIES.map((facility) => (
            <div
              key={facility.id}
              className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col justify-between"
            >
              <div className="aspect-16/10 overflow-hidden bg-slate-100">
                <img
                  src={facility.image}
                  alt={facility.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                    {facility.category}
                  </span>
                  <h4 className="font-semibold text-slate-900 text-sm mt-1">{facility.title}</h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {facility.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7 — TRUST / TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 block mb-2">
            Patient Stories
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Caring experiences in Bhopal.
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            *Demo patient feedback reflecting outpatient care experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between space-y-4"
            >
              <p className="text-sm text-slate-700 italic leading-relaxed">
                “{test.quote}”
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-900 block">{test.author}</span>
                  <span className="text-slate-500">{test.location}</span>
                </div>
                <span className="text-emerald-800 font-medium text-[11px]">
                  {test.treatment}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8 — EMERGENCY CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center justify-center md:justify-start gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              Need urgent medical attention?
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Our emergency department is available 24/7.
            </h3>
            <p className="text-sm text-slate-400 max-w-lg">
              Round-the-clock trauma team, critical care ambulances, and on-site emergency physicians stationed at Arera Colony, Bhopal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href={`tel:${HOSPITAL_INFO.emergency}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-all shadow-md active:scale-[0.98] text-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Emergency: {HOSPITAL_INFO.emergency}</span>
            </a>

            <button
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium rounded-xl transition-all text-sm"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Get Directions</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
