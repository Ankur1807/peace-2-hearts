
export interface Consultant {
  id: string;
  specialization: string;
  is_available: boolean;
  hourly_rate: number;
  profile_id: string;
  available_days?: string[] | null;
  bio?: string | null;
  qualifications?: string | null;
  profile_picture_url?: string | null;
  name?: string | null;
  experience?: number | null;
}

export interface CreateConsultantData extends Omit<Consultant, 'id'> {
  profile_picture: File | null;
}
