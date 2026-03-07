import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Briefcase, FileText, MessageSquare, Video, ArrowRight, CheckCircle, Star, Users } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'AI Resume Analyzer',
    description: 'Upload your resume and get an instant score, skill analysis, and optimization tips.',
    color: 'bg-blue-500/20 text-blue-400',
  },
  {
    icon: MessageSquare,
    title: 'Career Chatbot',
    description: 'Get 24/7 career advice, resume tips, and job search help from our AI assistant.',
    color: 'bg-emerald-500/20 text-emerald-400',
  },
  {
    icon: Video,
    title: 'Interview Simulator',
    description: 'Practice interviews with AI-generated questions based on your specific resume.',
    color: 'bg-purple-500/20 text-purple-400',
  },
  {
    icon: Briefcase,
    title: 'Smart Job Matching',
    description: 'Find jobs that perfectly match your skills and experience using AI algorithms.',
    color: 'bg-orange-500/20 text-orange-400',
  },
];

export default function Home() {
  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-gray-300">The #1 AI-Powered Career Platform</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            Land Your Dream Job with <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI-Powered Intelligence
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            The modern job portal that uses advanced AI to analyze your resume, 
            simulate interviews, and match you with the perfect career opportunities.
          </p>
          <div className="flex flex-col sm:row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/register" className="btn-primary text-lg px-10 py-4 flex items-center space-x-2">
              <span>Get Started for Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/jobs" className="btn-secondary text-lg px-10 py-4">
              Browse All Jobs
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-gray-400">Powerful AI tools designed to give you a competitive edge.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-8 hover:border-primary/30 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="glass-card p-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">50,000+</div>
            <div className="text-gray-400 font-medium">Active Job Seekers</div>
          </div>
          <div className="border-y md:border-y-0 md:border-x border-white/10 py-8 md:py-0">
            <div className="text-4xl font-bold text-secondary mb-2">2,500+</div>
            <div className="text-gray-400 font-medium">Top Companies</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-emerald-400 mb-2">15,000+</div>
            <div className="text-gray-400 font-medium">Successful Hires</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 p-12 md:p-24 text-center">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Level Up Your Career?</h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of professionals who have used AI Smart Job Portal to find their next big opportunity.
            </p>
            <Link to="/register" className="btn-primary text-lg px-12 py-4">
              Create Your Account Now
            </Link>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/20 blur-[120px] rounded-full" />
        </div>
      </section>
    </div>
  );
}
