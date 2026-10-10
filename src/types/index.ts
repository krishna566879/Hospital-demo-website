export interface Specialization {
  id: string;
  slug: string;
  name: string;
  description: string;
  doctorCount: number;
  iconName: string; // lucide icon identifier
  commonConditions: string[];
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specializationId: string;
  specializationName: string;
  experienceYears: number;
  qualification: string;
  languages: string[];
  bio: string;
  consultationFee: number;
  photoUrl: string;
  rating: number;
  reviewCount: number;
  nextAvailability: string;
  workingDays: number[];
  availableHours: {
    start: string;
    end: string;
  };
  slotDurationMinutes: number;
}

export interface HospitalFacility {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  treatment: string;
}
