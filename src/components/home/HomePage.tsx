import React, { useState, useEffect } from 'react';
import { Doctor, Specialization } from '../../types';
import { hospitalService } from '../../services/hospitalService';
import { HOSPITAL_INFO, HOSPITAL_FACILITIES, TESTIMONIALS } from '../../data/mockData';
import { DoctorCard } from '../common/DoctorCard';
import { SpecializationCard } from '../common/SpecializationCard';
import { Button } from '../ui/Button';
import { CardSkeleton } from '../ui/Skeletons';
import {
  PhoneCall,
  ArrowRight,
  Award,
  Sparkles,
  Users,
  Building2,
  Clock,
  MapPin,
  Stethoscope,
  MessageCircle,
  Phone,
} from 'lucide-react';

interface HomePageProps {
  navigate: (route: string) => void;
  onSelectSpecialization: (spec: Specialization) => void;
  onViewDoctorProfile: (doctor: Doctor) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  navigate,
  onSelectSpecialization,
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
    <div className="space-y-16 sm:space-y-24 lg:space-y-32">
      {/* SECTION 1 — HERO */}
      <section className="relative pt-4 sm:pt-8 lg:pt-12 pb-6 sm:pb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-7 min-w-0">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-900 bg-emerald-50/80 px-2.5 sm:px-3 py-1 rounded-full border border-emerald-200/50 max-w-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                <span className="truncate">COMPASSIONATE CARE. ADVANCED MEDICINE.</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 leading-[1.14] text-balance break-words">
                Healthcare that puts people first.
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-xl leading-relaxed break-words">
                Trusted specialists, advanced facilities, and personal medical attention at Arera Colony, Bhopal.
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-4 pt-1 sm:pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/contact')}
                  leftIcon={<Phone className="w-4 h-4 shrink-0" />}
                  className="w-full sm:w-auto justify-center"
                >
                  Contact Us
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/specialists')}
                  rightIcon={<ArrowRight className="w-4 h-4 shrink-0" />}
                  className="w-full sm:w-auto justify-center"
                >
                  Explore Specialists
                </Button>

                <a
                  href={HOSPITAL_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 text-sm font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors w-full sm:w-auto min-h-[48px]"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>WhatsApp Us</span>
                </a>
              </div>

              {/* Small Trust Indicators */}
              <div className="pt-5 border-t border-slate-200/60 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <Clock className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>24/7 Emergency</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <Stethoscope className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>80+ Specialists</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <Users className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>50K+ Patients Served</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Quality Medical Photography + Floating Card */}
            <div className="lg:col-span-5 relative w-full max-w-full min-w-0 mx-auto">
              <div className="relative w-full max-w-full mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border border-slate-200/80 bg-slate-100 min-h-[260px] sm:min-h-[320px] lg:min-h-[420px] aspect-[4/3] sm:aspect-[16/10] lg:aspect-[5/6]">
                <img
                  src={HOSPITAL_INFO.heroImage}
                  alt="Doctor consulting patient in modern clinic suite"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full max-w-full h-full object-cover object-center block"
                />

                {/* Subtle gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-slate-950/10 to-transparent pointer-events-none" />

                {/* Floating Contact Card */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-white/50 shadow-lg space-y-2.5 sm:space-y-3">
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                      Need medical advice?
                    </span>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900 mt-0.5 leading-snug break-words">
                      Connect with our medical coordinators in Bhopal.
                    </h4>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/contact')}
                    className="w-full text-xs justify-center"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5 shrink-0" />}
                  >
                    Contact Hospital Desk
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — SPECIALIST FINDER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3 sm:gap-4">
          <div className="min-w-0">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 break-words">
              Find the right specialist.
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-1 max-w-xl break-words">
              Choose a medical specialty and consult doctors across major clinical departments.
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/specialists')}
            rightIcon={<ArrowRight className="w-4 h-4 shrink-0" />}
            className="text-emerald-900 font-semibold self-start sm:self-auto shrink-0"
          >
            All Specializations
          </Button>
        </div>

        {loading ? (
          <CardSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
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

      {/* SECTION 3 — THE NIVAAN STANDARD */}
      <section className="bg-emerald-950 text-emerald-50 rounded-2xl sm:rounded-3xl mx-3 sm:mx-6 lg:mx-8 py-10 sm:py-14 lg:py-16 px-4 sm:px-8 lg:px-12 overflow-hidden relative">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-8 sm:mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block mb-1.5">
              The Nivaan Standard
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white break-words">
              Why Central India trusts Nivaan for specialized care.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="space-y-2.5 sm:space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-800 flex items-center justify-center text-emerald-300 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white">Expert Specialists</h3>
              <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
                Experienced doctors across major specialties with decades of clinical excellence.
              </p>
            </div>

            <div className="space-y-2.5 sm:space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-800 flex items-center justify-center text-emerald-300 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white">Advanced Facilities</h3>
              <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
                Modern diagnostic and treatment infrastructure supporting precise medical decisions.
              </p>
            </div>

            <div className="space-y-2.5 sm:space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-800 flex items-center justify-center text-emerald-300 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white">Patient-First Experience</h3>
              <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
                Clear communication, transparent outpatient counseling, and a calm, supportive clinical environment.
              </p>
            </div>

            <div className="space-y-2.5 sm:space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-800 flex items-center justify-center text-emerald-300 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white">24/7 Emergency Care</h3>
              <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
                Continuous trauma and critical care support when you and your loved ones need it most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — FEATURED DOCTORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3 sm:gap-4">
          <div className="min-w-0">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 break-words">
              Meet our senior consultants.
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-1 break-words">
              Experienced medical leadership providing compassionate, evidence-based care.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/doctors')}
            rightIcon={<ArrowRight className="w-4 h-4 shrink-0" />}
            className="self-start sm:self-auto shrink-0"
          >
            View All Doctors
          </Button>
        </div>

        {loading ? (
          <CardSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {featuredDoctors.map((doc) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                onContact={() => navigate('/contact')}
                onViewProfile={onViewDoctorProfile}
              />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 5 — HOW TO CONSULT OUR SPECIALISTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 block mb-1.5">
            Patient Consultation Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 break-words">
            How to consult our specialists.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Direct access to senior medical consultants at our Arera Colony campus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 relative space-y-3 sm:space-y-4 shadow-2xs">
            <span className="text-2xl sm:text-3xl font-serif-heading font-semibold text-emerald-800/40 block">
              01
            </span>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">Explore Departments</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Browse our medical specializations and consult verified profiles of senior physicians and surgeons.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 relative space-y-3 sm:space-y-4 shadow-2xs">
            <span className="text-2xl sm:text-3xl font-serif-heading font-semibold text-emerald-800/40 block">
              02
            </span>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">Connect with Reception</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Reach our helpdesk via phone ({HOSPITAL_INFO.phone}) or WhatsApp to confirm outpatient consultation hours.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 relative space-y-3 sm:space-y-4 shadow-2xs">
            <span className="text-2xl sm:text-3xl font-serif-heading font-semibold text-emerald-800/40 block">
              03
            </span>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">Visit Our Hospital Campus</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Receive unhurried clinical evaluation in sound-insulated private suites at Arera Medical Avenue, Bhopal.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6 — FACILITIES (Editorial Image Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-8 sm:mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 block mb-1.5">
            Infrastructure & Equipment
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 break-words">
            Modern spaces built for healing and precision.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Engineered to meet national quality benchmarks with natural daylight and calm acoustics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {HOSPITAL_FACILITIES.map((facility) => (
            <div
              key={facility.id}
              className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col justify-between"
            >
              <div className="aspect-16/10 overflow-hidden bg-slate-100">
                <img
                  src={facility.image}
                  alt={facility.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
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
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 block mb-1.5">
            Patient Stories
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 break-words">
            Caring experiences in Bhopal.
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            *Demo patient feedback reflecting outpatient care experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {TESTIMONIALS.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 flex flex-col justify-between space-y-4"
            >
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                “{test.quote}”
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-slate-900 block truncate">{test.author}</span>
                  <span className="text-slate-500 block truncate">{test.location}</span>
                </div>
                <span className="text-emerald-800 font-medium text-[11px] shrink-0">
                  {test.treatment}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8 — EMERGENCY CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl sm:rounded-3xl bg-slate-900 text-white p-5 sm:p-8 md:p-12 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-2 text-center md:text-left min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center justify-center md:justify-start gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
              <span>Need urgent medical attention?</span>
            </span>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white break-words">
              Our emergency department is available 24/7.
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto md:mx-0">
              Round-the-clock trauma team, critical care ambulances, and on-site emergency physicians stationed at Arera Colony, Bhopal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href={`tel:${HOSPITAL_INFO.emergencyRaw}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-all shadow-md active:scale-[0.98] text-xs sm:text-sm text-center min-h-[44px]"
            >
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span>Call Emergency: {HOSPITAL_INFO.emergency}</span>
            </a>

            <button
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium rounded-xl transition-all text-xs sm:text-sm min-h-[44px]"
            >
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Get Directions</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
