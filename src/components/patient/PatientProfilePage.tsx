import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import { User, Phone, Mail, MapPin, Heart, Shield, Save } from 'lucide-react';

export const PatientProfilePage: React.FC = () => {
  const { patientProfile, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: patientProfile?.fullName || 'Rahul Sharma',
    email: patientProfile?.email || 'rahul.sharma@example.com',
    phone: patientProfile?.phone || '+91 98260 12345',
    dateOfBirth: patientProfile?.dateOfBirth || '1988-06-14',
    bloodGroup: patientProfile?.bloodGroup || 'B+',
    gender: patientProfile?.gender || 'Male',
    address: patientProfile?.address || 'Plot 18, Shahpura Sector B',
    city: patientProfile?.city || 'Bhopal, Madhya Pradesh',
    emergencyName: patientProfile?.emergencyContact.name || 'Pooja Sharma',
    emergencyRel: patientProfile?.emergencyContact.relationship || 'Spouse',
    emergencyPhone: patientProfile?.emergencyContact.phone || '+91 98260 54321',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateProfile({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        bloodGroup: formData.bloodGroup,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        emergencyContact: {
          name: formData.emergencyName,
          relationship: formData.emergencyRel,
          phone: formData.emergencyPhone,
        },
      });
      setIsSaving(false);
      showToast({
        type: 'success',
        title: 'Profile Saved',
        message: 'Your patient records and emergency details have been updated.',
      });
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
          Account Settings
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-0.5">
          Patient Profile & Medical ID
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Permanent EMR Identifier: <span className="font-mono font-semibold text-emerald-800">#{patientProfile?.id || 'PAT1042'}</span>
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Personal Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-700" />
            <span>Personal Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Legal Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact & Address Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>Contact & Residential Address</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mobile Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">Residential Street</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">City & State</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-600" />
            <span>Emergency Contact Person</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Contact Name</label>
              <input
                type="text"
                value={formData.emergencyName}
                onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Relationship</label>
              <input
                type="text"
                value={formData.emergencyRel}
                onChange={(e) => setFormData({ ...formData, emergencyRel: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Emergency Phone</label>
              <input
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            variant="primary"
            type="submit"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Profile Updates
          </Button>
        </div>
      </form>
    </div>
  );
};
