import { createFileRoute } from '@tanstack/react-router'

import { useState, useMemo } from 'react';
import { useTheme } from '@/utility/ThemeProvider';
import { User } from '@/types/adminTypes';
import { 
  Search, 
  Filter, 
  User as UserIcon, 
  RefreshCw, 
  Eye,
  Shield,
  ShieldOff,
  Calendar,
  Phone,
  TrendingUp,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { changeUserStatusMutation, userAdminQuery } from '@/hooks/adminHook';

const AdminUsersPage = () => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showReferralModal, setShowReferralModal] = useState(false);
  
  const { data, isLoading, isError, refetch } = userAdminQuery();
  
  // Filter users based on search and status filter
  const filteredUsers = useMemo(() => {
    if (!data?.users) return [];
    
    return data.users.filter(user => {
      const matchesSearch = 
        user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery);
      
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Error loading users
          </h2>
          <button 
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 md:p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">User Management</h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage user accounts, view referral details, and update status
          </p>
        </header>

        {/* Filters and Search */}
        <div className={`p-4 rounded-lg shadow-md mb-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 w-full rounded-md border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              />
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`px-3 py-2 rounded-md border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              
              <button
                onClick={() => refetch()}
                className={`p-2 rounded-md ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                } transition-colors`}
                title="Refresh data"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className={`rounded-lg shadow-md overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <th className="py-3 px-4 text-left">User</th>
                  <th className="py-3 px-4 text-left">Phone</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Role</th>
                  <th className="py-3 px-4 text-left">Joined</th>
                  <th className="py-3 px-4 text-left">Last Login</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 px-4 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <UserIcon className="h-12 w-12 text-gray-400 mb-2" />
                        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                          No users found matching your criteria
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user: any, index: number) => (
                    <motion.tr 
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className={`border-t ${isDark ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            isDark ? 'bg-gray-600' : 'bg-gray-200'
                          }`}>
                            <UserIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{user.first_name}</p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              ID: {user.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {user.phone}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : user.status === 'suspended'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin' || user.role === 'superadmin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(user.created_at)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {user.auth.last_login ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(user.auth.last_login)}
                          </div>
                        ) : (
                          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Never</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowReferralModal(true);
                            }}
                            className={`p-2 rounded-md ${
                              isDark 
                                ? 'text-yellow-400 hover:bg-gray-700' 
                                : 'text-yellow-600 hover:bg-gray-100'
                            } transition-colors`}
                            title="View referral details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          <StatusToggleButton user={user} isDark={isDark} />
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Referral Details Modal */}
        <AnimatePresence>
          {showReferralModal && selectedUser && (
            <ReferralModal 
              user={selectedUser} 
              onClose={() => {
                setShowReferralModal(false);
                setSelectedUser(null);
              }}
              isDark={isDark}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const StatusToggleButton = ({ user, isDark }: { user: User; isDark: boolean }) => {
  const mutation = changeUserStatusMutation();
  
  const handleStatusChange = () => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    mutation.mutate({ userId: user.id, newStatus });
  };
  
  return (
    <button
      onClick={handleStatusChange}
      disabled={mutation.isPending}
      className={`p-2 rounded-md transition-colors ${
        mutation.isPending
          ? 'opacity-50 cursor-not-allowed'
          : isDark
            ? 'hover:bg-gray-700'
            : 'hover:bg-gray-100'
      }`}
      title={user.status === 'active' ? 'Suspend user' : 'Activate user'}
    >
      {mutation.isPending ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : user.status === 'active' ? (
        <ShieldOff className="h-4 w-4 text-red-500" />
      ) : (
        <Shield className="h-4 w-4 text-green-500" />
      )}
    </button>
  );
};

const ReferralModal = ({ user, onClose, isDark }: { user: User; onClose: () => void; isDark: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
          isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Referral Details for {user.first_name}</h2>
            <button
              onClick={onClose}
              className={`p-1 rounded-full ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } transition-colors`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* User Referral Summary */}
          <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center p-4 rounded-md bg-opacity-20 bg-yellow-500">
                <Users className="h-8 w-8 mb-2 text-yellow-500" />
                <h3 className="font-semibold">Total Referrals</h3>
                <p className="text-2xl font-bold">{user.userReferral.total_referrals}</p>
              </div>
              
              <div className="flex flex-col items-center justify-center p-4 rounded-md bg-opacity-20 bg-green-500">
                <TrendingUp className="h-8 w-8 mb-2 text-green-500" />
                <h3 className="font-semibold">Total Earnings</h3>
                <p className="text-2xl font-bold">${user.userReferral.total_earnings.toFixed(2)}</p>
              </div>
              
              <div className="flex flex-col items-center justify-center p-4 rounded-md bg-opacity-20 bg-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <h3 className="font-semibold">Referral Code</h3>
                <p className="text-xl font-bold">{user.userReferral.referral_code}</p>
              </div>
            </div>
          </div>
          
          {/* Referrals Made */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Referrals Made
            </h3>
            
            {user.referralsMade.length === 0 ? (
              <p className={`italic ${isDark ? 'text-gray-400' : 'text-gray-500'} p-3 text-center`}>
                No referrals made by this user
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <th className="py-2 px-3 text-left">Referee</th>
                      <th className="py-2 px-3 text-left">Phone</th>
                      <th className="py-2 px-3 text-left">Status</th>
                      <th className="py-2 px-3 text-left">Claimed At</th>
                      <th className="py-2 px-3 text-left">Expires At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.referralsMade.map((referral, index) => (
                      <tr key={index} className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        <td className="py-2 px-3">{referral.referee.first_name}</td>
                        <td className="py-2 px-3">{referral.referee.phone}</td>
                        <td className="py-2 px-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            referral.status === 'claimed' 
                              ? 'bg-green-100 text-green-800' 
                              : referral.status === 'expired'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          {referral.claimed_at ? new Date(referral.claimed_at).toLocaleDateString() : 'Not claimed'}
                        </td>
                        <td className="py-2 px-3">{new Date(referral.expires_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* Referrals Used */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Referrals Used
            </h3>
            
            {user.referralsUsed.length === 0 ? (
              <p className={`italic ${isDark ? 'text-gray-400' : 'text-gray-500'} p-3 text-center`}>
                No referrals used by this user
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <th className="py-2 px-3 text-left">Referrer</th>
                      <th className="py-2 px-3 text-left">Phone</th>
                      <th className="py-2 px-3 text-left">Status</th>
                      <th className="py-2 px-3 text-left">Claimed At</th>
                      <th className="py-2 px-3 text-left">Expires At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.referralsUsed.map((referral, index) => (
                      <tr key={index} className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        <td className="py-2 px-3">{referral.referrer.first_name}</td>
                        <td className="py-2 px-3">{referral.referrer.phone}</td>
                        <td className="py-2 px-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            referral.status === 'claimed' 
                              ? 'bg-green-100 text-green-800' 
                              : referral.status === 'expired'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          {referral.claimed_at ? new Date(referral.claimed_at).toLocaleDateString() : 'Not claimed'}
                        </td>
                        <td className="py-2 px-3">{new Date(referral.expires_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};


export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AdminUsersPage />;
}
