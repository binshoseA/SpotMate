export type ActivityCategory =
  | "Belajar"
  | "Nugas"
  | "Diskusi"
  | "Main"
  | "Olahraga"
  | "Hangout"
  | "Kreatif"
  | "Event kecil";

export type SpotFacility =
  | "Wi-Fi"
  | "Colokan"
  | "AC"
  | "Sunyi"
  | "Outdoor"
  | "Indoor"
  | "Luas"
  | "Dekat kantin"
  | "Boleh ngobrol";

export type Profile = {
  id: string;
  user_id: string;
  name: string;
  major: string | null;
  semester: number | null;
  created_at: string;
};

export type Spot = {
  id: string;
  name: string;
  description: string;
  location: string;
  facilities: SpotFacility[];
  suitable_for: ActivityCategory[];
  image_url: string | null;
  created_at: string;
};

export type Activity = {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  spot_id: string;
  creator_id: string;
  activity_time: string;
  max_participants: number;
  created_at: string;
};

export type ActivityParticipant = {
  id: string;
  activity_id: string;
  user_id: string;
  joined_at: string;
};

export type ActivityWithMeta = Activity & {
  spots?: Pick<Spot, "name" | "location"> | null;
  participant_count: number;
  has_joined: boolean;
};

export type ParticipantWithProfile = Pick<
  ActivityParticipant,
  "user_id" | "joined_at"
> & {
  profile?: Pick<Profile, "name" | "major" | "semester"> | null;
};
