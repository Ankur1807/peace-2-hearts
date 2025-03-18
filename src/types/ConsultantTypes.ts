
export interface ConsultantProfile {
  id: string;
  full_name: string;
  email: string;
  specialization: string;
  bio: string;
  qualifications: string;
  hourly_rate: number;
  available_days: string[];
  available_hours: string;
  profile_image_url?: string;
  avg_rating?: number;
  reviews_count?: number;
  is_available: boolean;
}
