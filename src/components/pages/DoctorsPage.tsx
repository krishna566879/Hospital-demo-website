import React, { useState, useEffect } from 'react';
import { Doctor, Specialization } from '../../types';
import { hospitalService } from '../../services/hospitalService';
import { HOSPITAL_INFO } from '../../data/mockData';
import { DoctorCard } from '../common/DoctorCard';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CardSkeleton } from '../ui/Skeletons';
import { Search, Star, Phone, MessageCircle } from 'lucide-react';

interface DoctorsPageProps {
  navigate?: (route: string) => void;
  initialSpecialtyId?: string;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({ navigate, initialSpecialtyId }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(initialSpecialtyId || 'all');
  const [search, setSearch] = useState('');

  // Doctor detail modal
  const [activeDoctorModal, setActiveDoctorModal] = useState<Doctor | null>(null);

  useEffect(() => {
    if (initialSpecialtyId) {
      setSelectedSpecialty(initialSpecialtyId);
    }
  }, [initialSpecialtyId]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [docs, specs] = await Promise.all([
          hospitalService.getDoctors(),
          hospitalService.getSpecializations(),
        ]);
        setDoctors(docs);
        setSpecializations(specs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleContactDoctor = (_doc: Doctor) => {
    if (navigate) {
      navigate('/contact');
    } else {
      window.location.hash = '/contact';
    }
  };

  const filtered = doctors.filter((doc) => {
    if (selectedSpecialty !== 'all' && doc.specializationId !== selectedSpecialty) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        doc.name.toLowerCase().includes(q) ||
        doc.specializationName.toLowerCase().includes(q) ||
        doc.languages.some((l) => l.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-10">
      <div className="max-w-2xl min-w-0">
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 sm:px-3 py-1 rounded-full border border-emerald-200/60 inline-flex items-center gap-1.5 max-w-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
          <span className="truncate">Medical Directory & Specialists</span>
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mt-2 break-words">
          Consult Our Senior Doctors
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-2 leading-relaxed break-words">
          Browse verified profiles, medical qualifications, outpatient consultation hours, and department details at Nivaan Multispeciality Hospital, Bhopal.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 shrink-0" />
          <input
            type="text"
            placeholder="Search by doctor name, specialty, language..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-2xs"
          />
        </div>

        <div className="w-full sm:w-auto shrink-0">
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-2xs sm:min-w-[200px]"
          >
            <option value="all">All Specialties ({doctors.length})</option>
            {specializations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor Grid */}
      {loading ? (
        <CardSkeleton count={8} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          <h3 className="text-base font-semibold text-slate-800">No doctors match your search</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your specialty filter or clearing your query.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setSearch('');
              setSelectedSpecialty('all');
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((doc) => (
            <DoctorCard
              key={doc.id}
              doctor={doc}
              onContact={handleContactDoctor}
              onViewProfile={(d) => setActiveDoctorModal(d)}
            />
          ))}
        </div>
      )}

      {/* Doctor Detail Modal */}
      {activeDoctorModal && (
        <Modal
          isOpen={!!activeDoctorModal}
          onClose={() => setActiveDoctorModal(null)}
          title={activeDoctorModal.name}
          description={activeDoctorModal.title}
          maxWidth="md"
        >
          <div className="space-y-4 sm:space-y-5 text-xs text-slate-700">
            {/* Header info */}
            <div className="flex items-start gap-3 sm:gap-4 pb-4 border-b border-slate-100">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
                <img
                  src={activeDoctorModal.photoUrl}
                  alt={activeDoctorModal.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <span className="text-emerald-800 font-semibold block break-words">{activeDoctorModal.qualification}</span>
                <p className="text-slate-500">
                  {activeDoctorModal.experienceYears} Years Clinical Experience
                </p>
                <div className="flex items-center gap-1 text-slate-600">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                  <span className="font-semibold text-slate-800">{activeDoctorModal.rating}</span>
                  <span className="text-slate-400">({activeDoctorModal.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-1 text-sm">About the Consultant</h4>
              <p className="text-slate-600 leading-relaxed break-words">{activeDoctorModal.bio}</p>
            </div>

            <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
                <span className="text-slate-500 font-medium">Department</span>
                <span className="font-semibold text-slate-800 sm:text-right">{activeDoctorModal.specializationName}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2 border-t border-slate-200/50 pt-2 sm:border-0 sm:pt-0">
                <span className="text-slate-500 font-medium">Languages Spoken</span>
                <span className="font-semibold text-slate-800 sm:text-right">{activeDoctorModal.languages.join(', ')}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2 border-t border-slate-200/50 pt-2 sm:border-0 sm:pt-0">
                <span className="text-slate-500 font-medium">OPD Consultation Hours</span>
                <span className="font-semibold text-slate-800 tabular-nums sm:text-right">
                  {activeDoctorModal.availableHours.start} – {activeDoctorModal.availableHours.end} (Mon–Sat)
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2 border-t border-slate-200/50 pt-2 sm:border-0 sm:pt-0">
                <span className="text-slate-500 font-medium">Consultation Fee</span>
                <span className="font-semibold text-emerald-900 text-sm tabular-nums sm:text-right">
                  ₹{activeDoctorModal.consultationFee}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveDoctorModal(null)}
                className="w-full sm:w-auto justify-center"
              >
                Close
              </Button>
              <a
                href={HOSPITAL_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors w-full sm:w-auto min-h-[38px]"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>WhatsApp Desk</span>
              </a>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setActiveDoctorModal(null);
                  handleContactDoctor(activeDoctorModal);
                }}
                leftIcon={<Phone className="w-3.5 h-3.5 shrink-0" />}
                className="w-full sm:w-auto justify-center"
              >
                Contact OPD Desk
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
