import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, 
  Mic, 
  MicOff, 
  Send, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Award, 
  Zap,
  ArrowRight,
  Play,
  RotateCcw
} from 'lucide-react';
import { aiService } from '../services/api';

export default function InterviewSimulator() {
  const [step, setStep] = useState<'start' | 'interview' | 'feedback'>('start');
  const [type, setType] = useState<'technical' | 'behavioral' | 'mixed'>('mixed');
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);

  const startInterview = async () => {
    setLoading(true);
    try {
      const res = await aiService.startInterview(type);
      setQuestion(res.data.question);
      setStep('interview');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      const res = await aiService.submitAnswer(question, answer);
      setFeedback(res.data);
      setStep('feedback');
    } catch (err) {
      console.error('Error submitting answer:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {step === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-12 text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-8">
              <Video className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">AI Interview Simulator</h1>
            <p className="text-gray-400 max-w-xl mx-auto mb-12">
              Practice your interview skills with our AI. We'll generate questions 
              based on your resume and provide instant feedback on your answers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
              {[
                { id: 'technical', label: 'Technical', icon: Zap },
                { id: 'behavioral', label: 'Behavioral', icon: Award },
                { id: 'mixed', label: 'Mixed', icon: Video },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setType(item.id as any)}
                  className={`p-6 rounded-2xl border transition-all ${
                    type === item.id 
                      ? 'bg-primary/10 border-primary text-primary' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-8 h-8 mx-auto mb-3" />
                  <span className="font-bold">{item.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={startInterview}
              disabled={loading}
              className="btn-primary px-12 py-4 text-xl flex items-center justify-center space-x-3 mx-auto disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Play className="w-6 h-6" />
                  <span>Start Interview</span>
                </>
              )}
            </button>
          </motion.div>
        )}

        {step === 'interview' && (
          <motion.div
            key="interview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            <div className="glass-card p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                  Question 1
                </div>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <h2 className="text-2xl font-bold leading-tight">
                {question}
              </h2>
            </div>

            <div className="glass-card p-8 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-400">Your Answer</h3>
                <button 
                  onClick={() => setIsRecording(!isRecording)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                    isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span className="text-sm font-medium">{isRecording ? 'Stop Recording' : 'Voice Input'}</span>
                </button>
              </div>
              <textarea
                className="w-full h-48 glass-input p-6 text-lg leading-relaxed resize-none"
                placeholder="Type your answer here or use voice input..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Tip: Be specific and use the STAR method for behavioral questions.
                </p>
                <button
                  onClick={submitAnswer}
                  disabled={!answer.trim() || loading}
                  className="btn-primary px-10 py-3 flex items-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Submit Answer</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'feedback' && feedback && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-6">
                <Award className="w-10 h-10 text-emerald-400" />
              </div>
              <h1 className="text-4xl font-bold mb-2">Interview Feedback</h1>
              <p className="text-gray-400">Here's how you performed on this question.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-8 text-center md:col-span-1">
                <div className="text-sm text-gray-400 mb-2 uppercase tracking-widest font-bold">Score</div>
                <div className="text-6xl font-bold text-primary mb-4">{feedback.score}<span className="text-2xl text-gray-600">/10</span></div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${feedback.score * 10}%` }}
                  />
                </div>
              </div>

              <div className="glass-card p-8 md:col-span-2 space-y-6">
                <div>
                  <h3 className="font-bold text-emerald-400 flex items-center space-x-2 mb-3">
                    <CheckCircle className="w-5 h-5" />
                    <span>What was good</span>
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{feedback.feedback}</p>
                </div>
                <div className="pt-6 border-t border-white/10">
                  <h3 className="font-bold text-orange-400 flex items-center space-x-2 mb-3">
                    <AlertCircle className="w-5 h-5" />
                    <span>How to improve</span>
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{feedback.improvement}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button
                onClick={() => {
                  setStep('interview');
                  setAnswer('');
                  setFeedback(null);
                  startInterview();
                }}
                className="btn-primary px-12 py-4 flex items-center space-x-2 w-full sm:w-auto"
              >
                <span>Next Question</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setStep('start');
                  setAnswer('');
                  setFeedback(null);
                }}
                className="btn-secondary px-12 py-4 flex items-center space-x-2 w-full sm:w-auto"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Restart Session</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
