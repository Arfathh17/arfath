import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Award, 
  Target, 
  Zap,
  BookOpen,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { resumeService } from '../services/api';
import { ResumeAnalysis } from '../types';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await resumeService.getMyResume();
        if (res.data) setAnalysis(res.data.analysis);
      } catch (err) {
        console.error('Error fetching resume:', err);
      }
    };
    fetchResume();
  }, []);

  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    setError('');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await resumeService.analyze(formData);
      setAnalysis(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">AI Resume Analyzer</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Upload your resume in PDF format and let our advanced AI analyze your skills, 
          experience, and provide actionable suggestions to land more interviews.
        </p>
      </div>

      {!analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 text-center"
        >
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-3xl p-12 transition-all cursor-pointer ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-white/20'
            }`}
          >
            <input {...getInputProps()} />
            <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10">
              <Upload className={`w-10 h-10 ${isDragActive ? 'text-primary' : 'text-gray-500'}`} />
            </div>
            {file ? (
              <div className="space-y-4">
                <p className="text-xl font-bold text-primary">{file.name}</p>
                <p className="text-sm text-gray-500">Ready to analyze</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xl font-bold text-gray-300">Drag & drop your resume here</p>
                <p className="text-sm text-gray-500">or click to browse files (PDF only)</p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-6 flex items-center justify-center space-x-2 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="mt-8 btn-primary px-12 py-4 text-lg disabled:opacity-50 flex items-center justify-center space-x-3 mx-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Analyzing with AI...</span>
              </>
            ) : (
              <>
                <Zap className="w-6 h-6" />
                <span>Analyze Resume</span>
              </>
            )}
          </button>
        </motion.div>
      )}

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Analysis */}
          <div className="lg:col-span-2 space-y-8">
            {/* Score Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 bg-gradient-to-br from-primary/10 to-secondary/10"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Resume Score</h2>
                  <p className="text-gray-400">Based on industry standards and AI analysis</p>
                </div>
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-white/10"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * analysis.score) / 100}
                      className="text-primary transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <span className="absolute text-2xl font-bold">{analysis.score}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold flex items-center space-x-2 text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                    <span>Strengths</span>
                  </h3>
                  <ul className="space-y-2">
                    {analysis.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start space-x-2">
                        <span className="text-emerald-500 mt-1">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold flex items-center space-x-2 text-orange-400">
                    <AlertCircle className="w-5 h-5" />
                    <span>Areas for Improvement</span>
                  </h3>
                  <ul className="space-y-2">
                    {analysis.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start space-x-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Detailed Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-6">
                <h3 className="font-bold mb-4 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  <span>Technical Skills</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.technicalSkills.map((skill, i) => (
                    <span key={i} className="bg-blue-400/10 text-blue-400 border border-blue-400/20 px-3 py-1 rounded-full text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="glass-card p-6">
                <h3 className="font-bold mb-4 flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  <span>Soft Skills</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.softSkills.map((skill, i) => (
                    <span key={i} className="bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-3 py-1 rounded-full text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
                <Award className="w-6 h-6 text-primary" />
                <span>Improvement Suggestions</span>
              </h3>
              <div className="space-y-4">
                {analysis.improvementSuggestions.map((s, i) => (
                  <div key={i} className="flex items-start space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">{i + 1}</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Recommendations */}
          <div className="space-y-8">
            <div className="glass-card p-6">
              <h3 className="font-bold mb-6 flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-primary" />
                <span>Suggested Roles</span>
              </h3>
              <div className="space-y-3">
                {analysis.suggestedJobRoles.map((role, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 group cursor-pointer hover:border-primary/30 transition-all">
                    <span className="text-sm font-medium">{role}</span>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-primary" />
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-bold mb-6 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-secondary" />
                <span>Skills to Learn</span>
              </h3>
              <div className="space-y-3">
                {analysis.skillsToLearn.map((skill, i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 bg-secondary/10 rounded-xl border border-secondary/20">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    <span className="text-sm font-medium text-secondary">{skill}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 btn-secondary text-sm">Find Courses</button>
            </div>

            <button 
              onClick={() => {setAnalysis(null); setFile(null);}}
              className="w-full btn-secondary py-4"
            >
              Analyze Another Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
