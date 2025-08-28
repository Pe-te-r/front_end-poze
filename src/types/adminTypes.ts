// Root response
export interface UsersResponse {
  message: string;
  users: User[];
}

// User object
export interface User {
  id: string;
  first_name: string;
  phone: string;
  status: "active" | "inactive" | "suspended"; // extend if needed
  role: "customer" | "admin" | "superadmin";   // extend if needed
  created_at: string; // ISO date string
  auth: Auth;
  pin: Pin;
  userReferral: UserReferral;
  referralsMade: ReferralMade[];
  referralsUsed: ReferralUsed[];
}

// Authentication info
export interface Auth {
  last_login: string | null;   // ISO date string or null
  locked_until: string | null; // ISO date string or null
}

// Pin info
export interface Pin {
  pin_set: boolean;
}

// Referral info owned by the user
export interface UserReferral {
  referral_code: string;
  total_referrals: number;
  total_earnings: number;
}

// A referral made by the user
export interface ReferralMade {
  status: "pending" | "claimed" | "expired";
  claimed_at: string | null;  // ISO date string or null
  expires_at: string;         // ISO date string
  referee: Referee;
}

// A referral used by the user
export interface ReferralUsed {
  status: "pending" | "claimed" | "expired";
  claimed_at: string | null;  // ISO date string or null
  expires_at: string;         // ISO date string
  referrer: Referrer;
}

// Referee details (someone referred by this user)
export interface Referee {
  id: string;
  first_name: string;
  phone: string;
  status: string;
}

// Referrer details (someone who referred this user)
export interface Referrer {
  id: string;
  first_name: string;
  phone: string;
  created_at: string;
  status: string;
}
