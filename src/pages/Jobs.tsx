import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Filter, 
  Clock, 
  ChevronRight,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { jobService } from '../services/api';
import { Job } from '../types';

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [applying, setApplying] = useState<number | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobService.getAll();
        setJobs(res.data);
        const appsRes = await jobService.getMyApplications();
        setAppliedJobs(appsRes.data.map((a: any) => a.job_id));
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = async (jobId: number) => {
    setApplying(jobId);
    try {
      await jobService.apply({ job_id: jobId, resume_url: 'default_resume.pdf' });
      setAppliedJobs([...appliedJobs, jobId]);
    } catch (err) {
      console.error('Error applying for job:', err);
    } finally {
      setApplying(null);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Find Your Next Role</h1>
          <p className="text-gray-400">Discover opportunities that match your AI-analyzed profile.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              className="w-full glass-input pl-12"
              placeholder="Search jobs, companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-3 glass-card hover:bg-white/10 transition-colors">
            <Filter className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-6 hover:border-primary/30 transition-all group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-all flex-shrink-0">
                    <Briefcase className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold group-hover:text-primary transition-colors">{job.title}</h2>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
                      <div className="flex items-center space-x-1.5">
                        <Briefcase className="w-4 h-4" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <DollarSign className="w-4 h-4" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 lg:pl-6 lg:border-l border-white/10">
                  {appliedJobs.includes(job.id) ? (
                    <div className="flex items-center space-x-2 text-emerald-400 font-semibold px-6 py-3">
                      <CheckCircle className="w-5 h-5" />
                      <span>Applied</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApply(job.id)}
                      disabled={applying === job.id}
                      className="btn-primary px-8 py-3 flex items-center space-x-2 disabled:opacity-50"
                    >
                      {applying === job.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <span>Apply Now</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                  <button className="p-3 glass-card hover:bg-white/10 transition-colors">
                    <div className="w-5 h-5 border-2 border-gray-500 rounded-md" />
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.requirements?.split(',').map((req, i) => (
                    <span key={i} className="text-[10px] uppercase tracking-wider font-bold bg-white/5 border border-white/10 px-2 py-1 rounded-md text-gray-500">
                      {req.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

          {filteredJobs.length === 0 && (
            <div className="text-center py-24 glass-card">
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No jobs found</h3>
              <p className="text-gray-400">Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
