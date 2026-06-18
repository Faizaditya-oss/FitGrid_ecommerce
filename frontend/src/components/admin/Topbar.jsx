import { Bell, Menu, Search } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Topbar = ({ toggleSidebar }) => {
  const { user } = useContext(AuthContext);

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4 flex-1">
          <button 
            className="lg:hidden text-slate-500 hover:text-slate-900"
            onClick={toggleSidebar}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="hidden md:flex items-center bg-slate-50 rounded-xl px-4 py-2 flex-1 max-w-md border border-slate-100 focus-within:border-slate-300 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none w-full text-sm text-slate-700"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <button className="relative text-slate-500 hover:text-slate-900 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-slate-100">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-slate-900">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
            {user?.profile_picture ? (
              <img src={user.profile_picture} alt="Profile" className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-200" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {(user?.name || 'A').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
