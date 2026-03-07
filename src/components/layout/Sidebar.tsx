import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Video, 
  Settings, 
  TrendingUp,
  Search
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Briefcase, label: 'Jobs', path: '/jobs' },
  { icon: FileText, label: 'Resume Analyzer', path: '/resume-analyzer' },
  { icon: MessageSquare, label: 'Career Chatbot', path: '/chatbot' },
  { icon: Video, label: 'Interview Simulator', path: '/interview-simulator' },
  { icon: TrendingUp, label: 'Recommendations', path: '/recommendations' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-black/30 backdrop-blur-xl border-r border-white/10 hidden lg:block">
      <div className="p-6 space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4">Menu</p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-colors",
                  "group-hover:text-primary"
                )} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-4 rounded-2xl border border-white/10">
            <p className="text-sm font-semibold mb-1">Upgrade to Pro</p>
            <p className="text-xs text-gray-400 mb-3">Get unlimited AI resume analysis and interview practice.</p>
            <button className="w-full btn-primary text-xs py-2">Upgrade Now</button>
          </div>
        </div>
      </div>
    </aside>
  );
}
