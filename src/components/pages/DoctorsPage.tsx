import React, { useState, useEffect } from 'react';
import { Doctor, Specialization } from '../../types';
import { hospitalService } from '../../services/hospitalService';
import { DoctorCard } from '../common/DoctorCard';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CardSkeleton } from '../ui/Skeletons';
import { Search, Filter, Calendar, Star, CheckCircle2, Clock, MapPin } from 'lucide-react';

interface DoctorsPageProps {
  onBookDoctor: (doctor: Doctor) => void;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({ onBookDoctor }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Doctor detail modal
  const [activeDoctorModal, setActiveDoctorModal] = useState<Doctor | null>(null);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
          Medical Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-1">
          Consult Our Senior Doctors
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          Browse verified profiles, medical qualifications, outpatient consultation hours, and real-time open slots.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by doctor name or language..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-700"
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
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((doc) => (
            <DoctorCard
              key={doc.id}
              doctor={doc}
              onBook={onBookDoctor}
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
          <div className="space-y-5 text-xs text-slate-700">
            <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={activeDoctorModal.photoUrl}
                  alt={activeDoctorModal.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="space-y-1">
                <span className="text-emerald-800 font-semibold">{activeDoctorModal.qualification}</span>
                <p className="text-slate-500">
                  {activeDoctorModal.experienceYears} Years Clinical Experience
                </p>
                <div className="flex items-center gap-1 text-slate-600">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-slate-800">{activeDoctorModal.rating}</span>
                  <span className="text-slate-400">({activeDoctorModal.reviewCount} verified reviews)</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-1">About the Consultant</h4>
              <p className="text-slate-600 leading-relaxed">{activeDoctorModal.bio}</p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Department</span>
                <span className="font-semibold text-slate-800">{activeDoctorModal.specializationName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Languages Spoken</span>
                <span className="font-semibold text-slate-800">{activeDoctorModal.languages.join(', ')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">OPD Consultation Hours</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  {activeDoctorModal.availableHours.start} - {activeDoctorModal.availableHours.end}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Consultation Fee</span>
                <span className="font-semibold text-emerald-900 text-sm tabular-nums">
                  ₹{activeDoctorModal.consultationFee}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setActiveDoctorModal(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const doc = activeDoctorModal;
                  setActiveDoctorModal(null);
                  onBookDoctor(doc);
                }}
                leftIcon={<Calendar className="w-3.5 h-3.5" />}
              >
                Book Appointment
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
