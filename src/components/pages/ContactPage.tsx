import React, { useState } from 'react';
import { HOSPITAL_INFO } from '../../data/mockData';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { MapPin, Phone, Mail, Clock, PhoneCall, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast({
        type: 'success',
        title: 'Inquiry Received',
        message: 'Our patient support coordinator in Bhopal will follow up with you within 2 hours.',
      });
      setForm({ name: '', email: '', phone: '', message: '' });
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
          Reach Our Healthcare Team
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-1">
          Contact Nivaan Multispeciality Hospital
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          Conveniently located in Arera Colony, Bhopal. Contact our OPD helpdesk, emergency department, or submit an inquiry.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Hospital Campus</h3>
                <p className="text-xs text-slate-500">Bhopal, Madhya Pradesh</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              {HOSPITAL_INFO.address}
            </p>
          </div>

          <div className="p-6 bg-rose-50/70 rounded-2xl border border-rose-200 shadow-xs space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-rose-950 text-sm">24/7 Emergency Line</h3>
                <p className="text-xs text-rose-700">Immediate Trauma Response</p>
              </div>
            </div>
            <a
              href={`tel:${HOSPITAL_INFO.emergency}`}
              className="text-lg font-bold text-rose-900 hover:underline block pt-1 tabular-nums"
            >
              {HOSPITAL_INFO.emergency}
            </a>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-1">
                <h4 className="font-semibold text-slate-900">OPD & Consultation Hours</h4>
                <p className="text-slate-600">{HOSPITAL_INFO.openingHours.opdWeekdays}</p>
                <p className="text-slate-600">{HOSPITAL_INFO.openingHours.opdSunday}</p>
                <p className="text-emerald-800 font-semibold pt-1">Emergency Department: 24 Hours Open</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-600">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>{HOSPITAL_INFO.email}</span>
            </div>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs">
          <h3 className="text-lg font-semibold text-slate-900">Send an Inquiry or Medical Question</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            For non-urgent queries regarding doctors, treatments, or health checkup packages.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. ramesh@example.com"
                  className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98260 xxxxx"
                className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Message / Query *</label>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="How can our clinical coordinator assist you?"
                className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <Button
              variant="primary"
              type="submit"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Submit Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
