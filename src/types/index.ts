export interface User {
  id: number;
  name: string;
  email: string;
  role: 'job_seeker' | 'recruiter' | 'admin';
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string;
  recruiter_id: number;
  created_at: string;
}

export interface Application {
  id: number;
  job_id: number;
  user_id: number;
  status: 'pending' | 'accepted' | 'rejected';
  resume_url: string;
  created_at: string;
  title?: string;
  company?: string;
}

export interface ResumeAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  technicalSkills: string[];
  softSkills: string[];
  experience: string[];
  education: string[];
  improvementSuggestions: string[];
  suggestedJobRoles: string[];
  skillsToLearn: string[];
}

export interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}
