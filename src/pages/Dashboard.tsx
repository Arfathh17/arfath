import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Briefcase, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Award,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { jobService, resumeService } from '../services/api';
import { Application, ResumeAnalysis } from '../types';

export default function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, resumeRes] = await Promise.all([
          jobService.getMyApplications(),
          resumeService.getMyResume()
        ]);
        setApplications(appsRes.data);
        setResume(resumeRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Applied Jobs', value: applications.length, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Resume Score', value: resume?.score || 'N/A', icon: Award, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Interviews', value: '0', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Profile Views', value: '124', icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  ];

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
          <p className="text-gray-400">Here's what's happening with your career today.</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Post New Job</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">+12%</span>
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold">Recent Applications</h2>
              <button className="text-primary text-sm font-medium hover:underline">View All</button>
            </div>
            <div className="divide-y divide-white/10">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <div key={app.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        <Briefcase className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-bold">{app.title}</h3>
                        <p className="text-sm text-gray-400">{app.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium">Applied on</p>
                        <p className="text-xs text-gray-500">{new Date(app.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        app.status === 'pending' ? 'bg-orange-400/10 text-orange-400' :
                        app.status === 'accepted' ? 'bg-emerald-400/10 text-emerald-400' :
                        'bg-red-400/10 text-red-400'
                      }`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-gray-500">
                  No applications yet. Start applying to jobs!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Recommendations / Resume Summary */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>AI Career Insights</span>
            </h2>
            {resume ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-2xl border border-primary/20">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Resume Score</p>
                    <p className="text-3xl font-bold text-primary">{resume.score}/100</p>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin-slow" />
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-300">Top Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {resume.analysis.technicalSkills.slice(0, 5).map((skill: string, i: number) => (
                      <span key={i} className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded-lg text-gray-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-300">Recommended Roles</p>
                  <div className="space-y-2">
                    {resume.analysis.suggestedJobRoles.slice(0, 3).map((role: string, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 group cursor-pointer hover:border-primary/30 transition-all">
                        <span className="text-sm">{role}</span>
                        <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-sm mb-6">Upload your resume to get AI-powered career insights.</p>
                <button className="w-full btn-secondary text-sm">Upload Resume</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
