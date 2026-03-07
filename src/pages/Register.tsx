import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Briefcase, Mail, Lock, User, ArrowRight, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { authService } from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'job_seeker'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.register(formData);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-card p-8 md:p-12"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 mb-6">
            <Briefcase className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-400">Join the AI-powered job revolution</p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'job_seeker' })}
              className={`p-4 rounded-xl border transition-all text-center ${
                formData.role === 'job_seeker' 
                  ? 'bg-primary/10 border-primary text-primary' 
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <User className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-semibold">Job Seeker</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'recruiter' })}
              className={`p-4 rounded-xl border transition-all text-center ${
                formData.role === 'recruiter' 
                  ? 'bg-secondary/10 border-secondary text-secondary' 
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <Briefcase className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-semibold">Recruiter</span>
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                required
                className="w-full glass-input pl-12"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                required
                className="w-full glass-input pl-12"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                required
                className="w-full glass-input pl-12"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-start space-x-2 ml-1">
            <ShieldCheck className="w-4 h-4 text-gray-500 mt-0.5" />
            <p className="text-xs text-gray-500 leading-tight">
              By registering, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-4 flex items-center justify-center space-x-2 text-lg disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Log In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
