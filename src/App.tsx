import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Chatbot from './pages/Chatbot';
import InterviewSimulator from './pages/InterviewSimulator';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return <>{children}</>;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/'].includes(location.pathname);
  const token = localStorage.getItem('token');

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        {token && !isAuthPage && <Sidebar />}
        <main className={`flex-1 p-6 md:p-10 mt-16 transition-all ${token && !isAuthPage ? 'lg:ml-64' : ''}`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/resume-analyzer" element={
            <ProtectedRoute>
              <ResumeAnalyzer />
            </ProtectedRoute>
          } />
          
          <Route path="/chatbot" element={
            <ProtectedRoute>
              <Chatbot />
            </ProtectedRoute>
          } />
          
          <Route path="/interview-simulator" element={
            <ProtectedRoute>
              <InterviewSimulator />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}
