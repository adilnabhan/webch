export type ChallengeCategory = 
  | 'workout' 
  | 'steps' 
  | 'cardio' 
  | 'weight_loss' 
  | 'nutrition' 
  | 'running' 
  | 'cycling' 
  | 'custom';

export type ChallengeType = 
  | 'performance' 
  | 'lucky_draw' 
  | 'gift_challenge' 
  | 'everyone_wins' 
  | 'community_goal' 
  | 'sponsored' 
  | 'referral' 
  | 'custom';

export type ChallengeStatus = 
  | 'draft' 
  | 'scheduled' 
  | 'active' 
  | 'upcoming' 
  | 'winner_selection' 
  | 'winners_announced' 
  | 'reward_distributed' 
  | 'completed' 
  | 'expired' 
  | 'cancelled';

export type CardStatus = 
  | 'active' 
  | 'joined' 
  | 'not_joined' 
  | 'upcoming' 
  | 'winner_selection' 
  | 'winners_announced' 
  | 'reward_distributed' 
  | 'completed';

export interface Brand {
  id: number;
  name: string;
  logo: string | null;
  website?: string;
  verified?: boolean;
}

export interface JoinedMember {
  id: number;
  profile_image: string | null;
  name?: string;
}

export interface ChallengeProgress {
  title?: string;
  current: number;
  target: number;
  percentage: number;
  is_eligible: boolean;
  workouts_completed?: number;
  workout_days_count?: number;
  min_days_required?: number;
  workout_dates?: string[];
  is_trainer_verified?: boolean;
}

export interface ChallengeFooter {
  type: 'countdown' | 'winner' | 'winner_selection' | 'reward';
  title: string;
  remaining_seconds?: number;
  description?: string;
  button_text?: string;
}

export interface ChallengeButton {
  text: string;
  action: 'details' | 'winners' | 'join';
  enabled: boolean;
}

export interface EligibilityEvaluation {
  eligible: boolean;
  current_count: number;
  required_count: number;
  metric: string;
  verification_type: string;
  operator: string;
  join_text: string;
  reason?: string;
}

export interface Challenge {
  id: number;
  name: string;
  short_description: string;
  start_date: string | null;
  end_date: string | null;
  overall_status?: string;
  user_challenge_status?: 'not_joined' | 'in_process' | 'joined';
  status: CardStatus | string;
  card_status?: CardStatus | string;
  category: string;
  challenge_type: string;
  challenge_type_value?: string;
  is_ending_soon?: boolean;
  theme_color?: string;
  banner_image: string | null;
  thumbnail_image: string | null;
  brand: Brand;
  is_joined: boolean;
  is_eligible: boolean;
  can_join: boolean;
  join_text: string;
  joined_member_count: number;
  joined_members: JoinedMember[];
  button?: ChallengeButton;
  footer?: ChallengeFooter;
  remaining_seconds: number;
  progress?: ChallengeProgress | null;
  eligibility?: EligibilityEvaluation | null;
}

export interface ChallengeReward {
  type: string;
  title: string;
  description?: string;
  image: string | null;
  winner_count: number;
  value: number | null;
  currency: string;
  distribution_status: 'pending' | 'distributed' | 'claimed' | 'expired';
}

export interface HowItWorksStep {
  icon: string;
  title: string;
  description: string;
}

export interface ChallengeTimeline {
  starts_at: string | null;
  ends_at: string | null;
  draw_date: string | null;
  remaining_seconds: number;
  server_time: string;
}

export interface ChallengeWinnerInfo {
  selection_method: string;
  announcement_date: string | null;
  is_announced: boolean;
  announced_winners: WinnerProfile[];
}

export interface WinnerProfile {
  id: number;
  name: string;
  profile_image: string | null;
  gym_name?: string | null;
  gym_logo?: string | null;
  rank: number;
  prize_title: string;
  selection_method?: string;
  awarded_at?: string;
  is_published?: boolean;
  progress?: any;
}

export interface ChallengeDetail extends Challenge {
  description: string;
  detailed_description?: string;
  reward: ChallengeReward;
  how_it_works: HowItWorksStep[];
  timeline: ChallengeTimeline;
  rules: string[];
  disqualification_rules: string[];
  terms_and_conditions: string[];
  winner: ChallengeWinnerInfo;
  winners: WinnerProfile[];
  total_winners?: number;
  is_winners_announced?: boolean;
  is_current_user_winner?: boolean;
  current_user_winner_rank?: number | null;
}

export interface WinnerHistoryItem {
  id: number;
  challenge_id: number;
  challenge_name: string;
  gym_name: string | null;
  gym_logo: string | null;
  theme_color: string;
  user_id: number;
  user_name: string;
  profile_pic: string | null;
  date: string;
  awarded_at: string;
  selection_method: string;
  selection_method_display: string;
  prize: string;
  rank: number;
  brand_name?: string;
  brand_logo?: string;
  reward_image?: string;
}

export interface AllWinnersResponse {
  status: string;
  challenge_count: number;
  total_challenges: number;
  total_winners: number;
  total_participants: number;
  gym_name?: string | null;
  gym_logo?: string | null;
  theme_color: string;
  winners: WinnerHistoryItem[];
  pagination?: {
    page: number;
    page_size: number;
    total_winners: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export interface WinnerPopupData {
  show_popup: boolean;
  winner?: {
    id: number;
    challenge_id: number;
    challenge_name: string;
    brand_name: string;
    theme_color: string;
    title: string;
    subtitle: string;
    message: string;
    profile_image: string | null;
    start_date?: string;
    end_date?: string;
    reward: {
      title: string;
      type: string;
      image: string | null;
      value: number | null;
      currency: string;
    };
    selection_method: string;
  };
}

export interface BrandPartner {
  id: number;
  name: string;
  brand_name: string;
  logo: string | null;
  brand_logo: string | null;
  website: string;
}

export interface AdminParticipant {
  id: number;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_picture?: string | null;
  };
  joined_at: string;
  status: 'active' | 'completed' | 'disqualified';
  progress_data: {
    workouts_completed?: number;
    workout_days_count?: number;
    min_days_required?: number;
    verified_days_count?: number;
    is_trainer_verified?: boolean;
    workout_dates?: string[];
    steps_taken?: number;
    calories_burned?: number;
  };
  is_eligible_for_winner: boolean;
  is_winner: boolean;
  rank: number | null;
}
