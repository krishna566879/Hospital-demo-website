import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, PatientProfile } from '../types';
import { INITIAL_PATIENT } from '../data/mockData';

interface AuthContextType {
  user: AuthUser | null;
  patientProfile: PatientProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, role?: 'patient' | 'admin') => Promise<void>;
  signup: (name: string, email: string, phone: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: 'patient' | 'admin' | 'guest') => void;
  updateProfile: (updated: Partial<PatientProfile>) => void;
}

const STORAGE_AUTH_KEY = 'nivaan_auth_user_v1';

const DEFAULT_PATIENT_USER: AuthUser = {
  id: 'PAT1042',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  role: 'patient',
  phone: '+91 98260 12345',
};

const DEFAULT_ADMIN_USER: AuthUser = {
  id: 'ADM001',
  name: 'Hospital Administration',
  email: 'admin@nivaanhospital.example',
  role: 'admin',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_AUTH_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    // Default to Patient for rich experience, or can be switched
    return DEFAULT_PATIENT_USER;
  });

  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(INITIAL_PATIENT);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_AUTH_KEY);
    }
  }, [user]);

  const login = async (email: string, role: 'patient' | 'admin' = 'patient') => {
    if (role === 'admin' || email.includes('admin')) {
      setUser(DEFAULT_ADMIN_USER);
    } else {
      setUser({
        ...DEFAULT_PATIENT_USER,
        email,
      });
    }
  };

  const signup = async (name: string, email: string, phone: string) => {
    const newUser: AuthUser = {
      id: `PAT${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      email,
      role: 'patient',
      phone,
    };
    setUser(newUser);
    setPatientProfile({
      ...INITIAL_PATIENT,
      id: newUser.id,
      fullName: name,
      email,
      phone,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: 'patient' | 'admin' | 'guest') => {
    if (role === 'guest') {
      setUser(null);
    } else if (role === 'admin') {
      setUser(DEFAULT_ADMIN_USER);
    } else {
      setUser(DEFAULT_PATIENT_USER);
    }
  };

  const updateProfile = (updated: Partial<PatientProfile>) => {
    if (patientProfile) {
      setPatientProfile({ ...patientProfile, ...updated });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        patientProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        signup,
        logout,
        switchRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
