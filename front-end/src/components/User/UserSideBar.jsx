import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Home,
  BarChart3,
  TrendingUp,
  User,
  Target,
  LogOut,
  Plus,
  CheckCircle,
  Clock,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';
import { logoutUser } from '../../store/auth';
const UserSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);





  const handleLogout = async () => {
    try {
      const data = await dispatch(logoutUser());
      console.log(data.payload);
      if (data.payload.success) {
        toast.success(data.payload.message);
      } else {
        toast.error(data.payload.message);
      }
    } catch (err) {
      toast.error(`something went wrong ${err}`);
    }
  };

 const menuItems = [
  {
    icon: Home,
    label: 'Movies',
    path: '/user/home',
    description: 'Get a new ticket'
  },
  {
    icon: Plus,
    label: 'My Tickets',
    path: '/user/MyTickets',
    description: 'Check your current bookings'
  },
  {
    icon: Plus,
    label: 'Resale Tickets',
    path: '/user/ResaleTickets',
    description: 'Buy tickets listed for resale'
  },
  {
    icon: BarChart3,
    label: 'My Selling',
    path: '/user/MySelling',
    description: 'Sell or transfer your tickets'
  },
  {
    icon: MessageSquare,
    label: 'Purchase History',
    path: '/user/history', // you don’t have this route yet, can add later
    description: 'View your past purchases & feedback'
  },
  {
    icon: User,
    label: 'Profile',
    path: '/user/profile',
    description: 'Manage your account'
  }
];


  const isActivePath = (path) => location.pathname === path;

  const activeGoals = stats ? stats.totalGoals - stats.completedGoals : 0;
  
  const weeklyProgress = stats?.overallCompletionRate || 0;

  return (
    <aside className="hidden md:flex fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-black backdrop-blur-md border-r border-white z-40 flex-col justify-between">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={` cursor-pointer w-full group flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-300 text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-cyan-200 text-black shadow-lg shadow-cyan-500/25 transform scale-[1.02]'
                    : 'text-white hover:text-cyan-500 hover:bg-cyan-500/5 hover:translate-x-1'
                }`}
              >
                <div
                  className={`p-1.5 rounded-md transition-colors duration-300 ${
                    isActive
                      ? 'bg-white/20'
                      : 'bg-white group-hover:bg-cyan-500/10'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors duration-300 ${
                      isActive
                        ? 'text-black'
                        : 'text-black group-hover:text-cyan-500'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div
                    className={`font-medium text-sm ${
                      isActive ? 'text-white' : 'text-white'
                    }`}
                  >
                    {item.label}
                  </div>
                  <div
                    className={`text-xs ${
                      isActive ? 'text-white/80' : 'text-white'
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
                {isActive && (
                  <div className="w-1 h-6 bg-white/50 rounded-full"></div>
                )}
              </button>
            );
          })}
        </nav>

      
      </div>

      <div className="p-6 border-t border-white">
        <button
          onClick={handleLogout}
          className="w-full group flex items-center space-x-3 px-3 py-3 rounded-lg 
                    transition-all duration-300 text-red-700 
                    hover:text-red-500 hover:bg-red-500/5 hover:translate-x-1 cursor-pointer   text-xl"
        >
          <span>Logout</span>
          <LogOut />
        </button>
      </div>
    </aside>
  );
};

export default UserSideBar;