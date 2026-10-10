import {
  Doctor,
  Specialization,
} from '../types';
import {
  INITIAL_SPECIALIZATIONS,
  INITIAL_DOCTORS,
  HOSPITAL_FACILITIES,
} from '../data/mockData';

class HospitalService {
  private doctors: Doctor[];
  private specializations: Specialization[];

  constructor() {
    this.specializations = [...INITIAL_SPECIALIZATIONS];
    this.doctors = [...INITIAL_DOCTORS];
  }

  public async getSpecializations(): Promise<Specialization[]> {
    return [...this.specializations];
  }

  public async getSpecializationBySlug(slug: string): Promise<Specialization | undefined> {
    return this.specializations.find((s) => s.slug === slug);
  }

  public async getDoctors(specializationId?: string): Promise<Doctor[]> {
    if (specializationId && specializationId !== 'all') {
      return this.doctors.filter((d) => d.specializationId === specializationId);
    }
    return [...this.doctors];
  }

  public async getDoctorById(id: string): Promise<Doctor | undefined> {
    return this.doctors.find((d) => d.id === id);
  }

  public getFacilities() {
    return [...HOSPITAL_FACILITIES];
  }
}

export const hospitalService = new HospitalService();
