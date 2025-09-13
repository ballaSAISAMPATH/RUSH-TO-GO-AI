import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteAccountAction } from '../../store/auth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../store/auth';
import { LogOut, User, KeyRound, Globe, Trash2, Mail } from 'lucide-react';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePasswordChange = () => {
    navigate('/user/set-new-password');
  };

  const handleLogout = async () => {
    try {
      const data = await dispatch(logoutUser()).unwrap();
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(`Something went wrong: ${err.message}`);
    }
  };

  const handleAccountDeletion = async () => {
    try {
      await dispatch(deleteAccountAction(user?.id)).unwrap();
      toast.success('Account deleted successfully. You will be logged out shortly.');
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Account deletion failed:', error);
      toast.error(error.message || 'Failed to delete account. Please try again.');
      setShowDeleteConfirm(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 p-6 flex items-center justify-center">
        <div className="text-gray-400 text-lg">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6 sm:p-12 text-gray-200">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-700">
          <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-3">
            <User size={36} className="text-cyan-500" />
            Account Settings
          </h1>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-md hover:from-red-700 hover:to-red-900 transition-all duration-300 transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut size={18} />
            <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>

        {/* Profile Details */}
        <div className="space-y-8 animate-fadeInUp">
          <div className="bg-gray-800 p-6 sm:p-8 rounded-xl border border-gray-700 shadow-lg transition-all duration-300 transform hover:scale-[1.01] hover:shadow-cyan-500/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label className="  text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <User size={16} className="text-cyan-500" /> Username
                </label>
                <input
                  type="text"
                  value={user?.userName || ""}
                  readOnly
                  className="w-full px-4 py-2 border-none rounded-md bg-gray-700 text-gray-300 cursor-not-allowed outline-none"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="  text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Mail size={16} className="text-cyan-500" /> Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full px-4 py-2 border-none rounded-md bg-gray-700 text-gray-300 cursor-not-allowed outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email address cannot be changed.
                </p>
              </div>
            </div>
          </div>
          
          {/* Sign-up Method & Password */}
          <div className="bg-gray-800 p-6 sm:p-8 rounded-xl border border-gray-700 shadow-lg transition-all duration-300 transform hover:scale-[1.01] hover:shadow-cyan-500/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sign-up Method */}
              <div>
                <label className="  text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Globe size={16} className="text-cyan-500" /> Sign-up Method
                </label>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full font-medium border border-green-500/30">
                    {(user?.authProvider || "email") === 'email' ? '📧 Email' : '🌐 Google'}
                  </span>
                  <span className="text-sm text-gray-500">
                    You signed up using {(user?.authProvider || "email") === 'email' ? 'email' : 'Google'}.
                  </span>
                </div>
              </div>
              
              {/* Change Password */}
              {(user?.authProvider || "email") === 'email' && (
                <div>
                  <label className="  text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                    <KeyRound size={16} className="text-cyan-500" /> Password
                  </label>
                  <button
                    onClick={handlePasswordChange}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-md hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 font-medium shadow-md hover:shadow-cyan-500/20"
                  >
                    Change Password
                  </button>
                  <p className="text-xs text-gray-500 mt-1">Update your account password.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Danger Zone */}
          <div className="bg-red-800/10 p-6 sm:p-8 rounded-xl border border-red-700 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <Trash2 size={24} className="text-red-500" />
              <h2 className="text-xl font-semibold text-red-400">!Warning</h2>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              Once you delete your account, there is no going back. All your data will be permanently removed. Please be certain.
            </p>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-md hover:from-red-700 hover:to-red-900 transition-all duration-300 transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isLoading ? 'Processing...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 border border-gray-700 shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-4">
              Confirm Account Deletion
            </h3>
            <p className="text-gray-400 mb-6 text-sm">
              Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently removed.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-400 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleAccountDeletion}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-md hover:from-red-700 hover:to-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tailwind CSS keyframes */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default UserProfile;