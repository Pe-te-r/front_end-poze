// types/dashboard.ts
export interface DashboardUser {
  id: string;
  first_name: string;
  phone: string;
  phone_verified: boolean;
  role: string;
  avatar_url: string | null;
  status: string;
  member_since: string;
}

export interface DashboardSecurity {
  login_attempts: number;
  last_login: string;
  account_locked: boolean;
  pin_set: boolean;
  pin_locked: boolean;
}

export interface DashboardReferral {
  code: string;
  is_active: boolean;
  total_referrals: number;
  total_earnings: number;
  total_earnings_formatted: string;
  last_updated: string;
}

export interface RecentReferral {
  id: string;
  referee_id: string;
  referee_first_name: string;
  referee_phone_partial: string;
  referral_code_used: string;
  status: string;
  expires_at: string;
  claimed_at: string | null;
  days_to_expire: number;
  is_expired: boolean;
}

export interface DashboardReferralStatistics {
  pending_claims: number;
  claimed_referrals: number;
  expired_claims: number;
  total_claims: number;
  recent_referrals: RecentReferral[];
}

export interface DashboardSummary {
  account_status: string;
  verification_complete: boolean;
  security_setup_complete: boolean;
  referral_program_active: boolean;
  total_network_size: number;
  lifetime_earnings: string;
  active_referral_code: string;
}

export interface DashboardData {
  user: DashboardUser;
  security: DashboardSecurity;
  referral: DashboardReferral;
  referral_statistics: DashboardReferralStatistics;
  summary: DashboardSummary;
}

export interface DashboardResponse {
  message: string;
  data: DashboardData;
}