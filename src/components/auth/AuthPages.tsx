import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { HOSPITAL_INFO } from '../../data/mockData';
import { Button } from '../ui/Button';
import { ShieldCheck, Mail, Lock, User, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthPagesProps {
  initialMode?: 'login' | 'signup' | 'forgot-password';
  navigate: (route: string) => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({ initialMode = 'login', navigate }) => {
  const { login, signup } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password'>(initialMode);
  const [email, setEmail] = useState('rahul.sharma@example.com');
  const [password, setPassword] = useState('••••••••••');
  const [name, setName] = useState('Rahul Sharma');
  const [phone, setPhone] = useState('+91 98260 12345');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const isAdmin = email.toLowerCase().includes('admin');
        await login(email, isAdmin ? 'admin' : 'patient');
        showToast({
          type: 'success',
          title: 'Welcome Back',
          message: `Signed in successfully as ${isAdmin ? 'Administrator' : 'Patient'}.`,
        });
        navigate(isAdmin ? '/admin' : '/my-appointments');
      } else if (mode === 'signup') {
        await signup(name, email, phone);
        showToast({
          type: 'success',
          title: 'Account Created',
          message: 'Welcome to Nivaan Hospital patient portal.',
        });
        navigate('/my-appointments');
      } else {
        // Forgot password
        setResetSent(true);
        showToast({
          type: 'info',
          title: 'Password Reset Queued',
          message: `Instructions sent to ${email} (Supabase Auth Mock).`,
          mockEmailNotice: true,
        });
      }
    } catch (err: any) {
      showToast({ type: 'error', title: 'Authentication Failed', message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Quick switch for reviewers
  const handleQuickLogin = (role: 'patient' | 'admin') => {
    if (role === 'admin') {
      setEmail('admin@nivaanhospital.example');
      setName('Hospital Administration');
      login('admin@nivaanhospital.example', 'admin');
      navigate('/admin');
    } else {
      setEmail('rahul.sharma@example.com');
      setName('Rahul Sharma');
      login('rahul.sharma@example.com', 'patient');
      navigate('/my-appointments');
    }
    showToast({
      type: 'success',
      title: 'Demo Persona Activated',
      message: `Signed in as ${role === 'admin' ? 'Administrator' : 'Patient (Rahul Sharma)'}.`,
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Side: Healthcare Imagery & Brand Message */}
        <div className="md:col-span-5 bg-emerald-950 text-emerald-100 p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4 relative z-10">
            <span className="text-xl font-bold tracking-tight text-white block">
              NIVAAN
            </span>
            <p className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
              Multispeciality Hospital · Bhopal
            </p>
            <h2 className="text-2xl font-bold text-white mt-4 leading-tight">
              “{HOSPITAL_INFO.tagline}”
            </h2>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Access your digital appointment records, doctor consultations, and diagnostic reports seamlessly.
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-emerald-900 space-y-2">
            <div className="flex items-center gap-2 text-xs text-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Prepared for Supabase Auth</span>
            </div>
            <p className="text-[11px] text-emerald-400/80">
              Session state preserved across booking & admin workflows.
            </p>
          </div>

          {/* Decorative faint glow */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-800/30 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Right Side: Authentication Form */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">
                {mode === 'login' && 'Sign in to Patient Portal'}
                {mode === 'signup' && 'Create Patient Account'}
                {mode === 'forgot-password' && 'Reset Your Password'}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {mode === 'login' && 'Enter your credentials to view upcoming appointments.'}
                {mode === 'signup' && 'Register for fast doctor booking and digital receipts.'}
                {mode === 'forgot-password' && 'Enter your registered email to receive a recovery link.'}
              </p>
            </div>

            {/* Quick Demo Fill Buttons */}
            <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                Quick 1-Click Demo Login:
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('patient')}
                  className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-700 text-xs rounded-lg border border-slate-200 font-medium transition-colors"
                >
                  Patient (Rahul)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="flex-1 py-1.5 px-2 bg-emerald-900 hover:bg-emerald-800 text-white text-xs rounded-lg font-medium transition-colors"
                >
                  Hospital Admin
                </button>
              </div>
            </div>

            {/* Form */}
            {mode === 'forgot-password' && resetSent ? (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-semibold text-emerald-900">Recovery Email Dispatched</h4>
                <p className="text-xs text-emerald-700">
                  Please check <strong>{email}</strong> for instructions to reset your password.
                </p>
                <Button variant="outline" size="sm" onClick={() => setMode('login')}>
                  Return to Sign In
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                        placeholder="e.g. Rahul Sharma"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      placeholder="e.g. rahul.sharma@example.com"
                    />
                  </div>
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Mobile Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                        placeholder="+91 98260 12345"
                      />
                    </div>
                  </div>
                )}

                {mode !== 'forgot-password' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">Password</label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => setMode('forgot-password')}
                          className="text-[11px] text-emerald-800 hover:underline"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                        placeholder="••••••••••••"
                      />
                    </div>
                  </div>
                )}

                <Button
                  variant="primary"
                  type="submit"
                  isLoading={isLoading}
                  className="w-full mt-2"
                >
                  {mode === 'login' && 'Sign In'}
                  {mode === 'signup' && 'Register Account'}
                  {mode === 'forgot-password' && 'Send Reset Link'}
                </Button>
              </form>
            )}
          </div>

          {/* Bottom Switcher */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-emerald-800 font-semibold hover:underline"
                >
                  Create one now
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-emerald-800 font-semibold hover:underline"
                >
                  Sign in here
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
