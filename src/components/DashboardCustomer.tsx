// components/Dashboard.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sun,
  Moon,
  RefreshCw,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import {  DashboardSecurity, RecentReferral } from '@/types/dashboardType';
import { useDashboard } from '@/hooks/dashboardHook';
import { useTheme } from '@/utility/ThemeProvider';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  className = '' 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType;
  trend?: string;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`rounded-xl p-4 shadow-md ${className}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        {trend && <p className="text-xs text-green-600 dark:text-green-400">{trend}</p>}
      </div>
      <div className="rounded-full p-2 bg-opacity-20 bg-current">
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </motion.div>
);

const ReferralItem = ({ referral }: { referral: RecentReferral }) => (
  <motion.div 
    className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
    whileHover={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
  >
    <div className="flex items-center space-x-3">
      <div className={`h-3 w-3 rounded-full ${
        referral.status === 'claimed' ? 'bg-green-500' : 
        referral.is_expired ? 'bg-red-500' : 'bg-yellow-500'
      }`} />
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{referral.referee_first_name}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{referral.referee_phone_partial}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-medium text-gray-900 dark:text-white">{referral.status}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {referral.is_expired ? 'Expired' : `${referral.days_to_expire}d left`}
      </p>
    </div>
  </motion.div>
);

const SecurityStatus = ({ security }: { security: DashboardSecurity }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security Status</h3>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 dark:text-blue-400 flex items-center"
        >
          {showDetails ? <EyeOff size={16} className="mr-1" /> : <Eye size={16} className="mr-1" />}
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          {security.pin_set ? (
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500 mr-2" />
          )}
          <span className="text-sm">PIN {security.pin_set ? 'Set' : 'Not Set'}</span>
        </div>
        
        <div className="flex items-center">
          {!security.account_locked ? (
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          )}
          <span className="text-sm">Account {security.account_locked ? 'Locked' : 'Active'}</span>
        </div>
        
        {showDetails && (
          <>
            <div className="col-span-2 text-sm text-gray-600 dark:text-gray-300">
              Last login: {new Date(security.last_login).toLocaleDateString()}
            </div>
            <div className="col-span-2 text-sm text-gray-600 dark:text-gray-300">
              Login attempts: {security.login_attempts}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CopyReferralCode = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
      <div>
        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Your Referral Code</p>
        <p className="font-mono text-blue-600 dark:text-blue-300">{code}</p>
      </div>
      <button
        onClick={copyToClipboard}
        className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
      >
        <Copy size={16} />
        <span>{copied ? 'Copied!' : 'Copy'}</span>
      </button>
    </div>
  );
};

export const Dashboard = ({ dashboardId }: { dashboardId: string }) => {
  const { data, isLoading, error, refetch } = useDashboard(dashboardId);
  const { isDark, toggleTheme } = useTheme();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-gray-900 dark:text-white">Failed to load dashboard</p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error?.message || 'Unknown error'}</p>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  const { user, security, referral, referral_statistics, summary } = data.data;
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full px-4 py-2 transition-colors">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.first_name} 
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <span>{user.first_name}</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {user.first_name}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your account overview and recent activity.
          </p>
        </motion.section>
        
        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Referrals"
            value={referral.total_referrals}
            icon={Users}
            trend="+12% this month"
            className="bg-white dark:bg-gray-800"
          />
          <StatCard
            title="Total Earnings"
            value={referral.total_earnings_formatted}
            icon={TrendingUp}
            trend="+₦5,200 this month"
            className="bg-white dark:bg-gray-800"
          />
          <StatCard
            title="Network Size"
            value={summary.total_network_size}
            icon={Users}
            className="bg-white dark:bg-gray-800"
          />
          <StatCard
            title="Member Since"
            value={new Date(user.member_since).getFullYear()}
            icon={Clock}
            className="bg-white dark:bg-gray-800"
          />
        </section>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Referral Code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <CopyReferralCode code={referral.code} />
            </motion.div>
            
            {/* Security Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SecurityStatus security={security} />
            </motion.div>
            
            {/* Referral Statistics */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4">Referral Statistics</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">Pending Claims</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                    {referral_statistics.pending_claims}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">Claimed Referrals</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-300">
                    {referral_statistics.claimed_referrals}
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">Expired Claims</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">
                    {referral_statistics.expired_claims}
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <p className="text-sm text-purple-800 dark:text-purple-200">Total Claims</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                    {referral_statistics.total_claims}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Referrals */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Referrals</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {referral_statistics.recent_referrals.length} total
                </span>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {referral_statistics.recent_referrals.length > 0 ? (
                  referral_statistics.recent_referrals.map((ref:any) => (
                    <ReferralItem key={ref.id} referral={ref} />
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No recent referrals
                  </p>
                )}
              </div>
            </motion.div>
            
            {/* Account Status */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Verification</span>
                  {summary.verification_complete ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Security Setup</span>
                  {summary.security_setup_complete ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Referral Program</span>
                  {summary.referral_program_active ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium">Overall Status</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: summary.verification_complete && summary.security_setup_complete ? '100%' : '50%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};