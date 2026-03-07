import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, User, LogOut, Menu } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">AI Smart Job Portal</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link to="/jobs" className="text-gray-300 hover:text-white transition-colors">Find Jobs</Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
                  <div className="flex items-center space-x-4 pl-4 border-l border-white/10">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>
                    <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-white transition-colors">
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
                  <Link to="/register" className="btn-primary">Register</Link>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button className="p-2 text-gray-400">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
