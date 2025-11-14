import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl flex flex-col fixed left-0 top-0 bottom-0">
        <div className="p-6 flex-1 flex flex-col overflow-y-auto">
          <div className="mb-8 pb-6 border-b border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fi fi-rr-box text-2xl text-white"></i>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Stok Takip</h2>
                <p className="text-xs text-blue-300">Yönetim Sistemi</p>
              </div>
            </div>
          </div>

          <div className="mb-8 bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                <i className="fi fi-rr-user text-lg text-white"></i>
              </div>
              <div>
                <p className="text-xs text-slate-400">Hoş geldiniz</p>
                <p className="font-semibold text-white">{username}</p>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            <Link
              to="/depo-yonetimi"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive('/depo-yonetimi')
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <i className={`fi ${isActive('/depo-yonetimi') ? 'fi-sr-warehouse-alt' : 'fi-rr-warehouse-alt'} text-xl`}></i>
              <span className="font-medium">Depo Yönetimi</span>
            </Link>
            
            <Link
              to="/stok-listesi"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive('/stok-listesi')
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <i className={`fi ${isActive('/stok-listesi') ? 'fi-sr-boxes' : 'fi-rr-boxes'} text-xl`}></i>
              <span className="font-medium">Stok Listesi</span>
            </Link>
          </nav>

          <div className="mt-auto pt-6">
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <i className="fi fi-rr-exit text-lg"></i>
              <span className="font-medium">Çıkış Yap</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto ml-72">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
