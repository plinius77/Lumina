import React, { useState } from 'react';
import { LogIn, GraduationCap, Presentation, Loader2, Mail, Lock, UserPlus, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';

interface AuthProps {
  onLogin: (id: string, role: 'teacher' | 'student', name: string) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot-password' | 'reset-sent';

export default function Auth({ onLogin }: AuthProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<'teacher' | 'student'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) throw new Error('Name is required for sign up.');
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('Signup failed. Please try again.');

        const { error: profileError } = await supabase
          .from('users')
          .insert([{ id: authData.user.id, name: name.trim(), role }]);

        if (profileError) throw profileError;

        onLogin(authData.user.id, role, name.trim());
      } else if (mode === 'login') {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('Login failed.');

        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError) throw profileError;

        onLogin(authData.user.id, profileData.role, profileData.name);
      } else if (mode === 'forgot-password') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMode('reset-sent');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      let message = error.message || 'Authentication failed.';
      if (message.includes('Invalid login credentials')) {
        message = 'Invalid email or password. If you don\'t have an account, please sign up first.';
      }
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const Logo = () => (
    <div className="flex items-center gap-2 mb-8 justify-center">
      <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
        <GraduationCap className="w-7 h-7 text-white" />
      </div>
      <div className="text-left">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">Lumina Edu</h1>
        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase">AI Learning Platform</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row transition-colors">
      {/* Left Side: Decorative/Info (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full -ml-48 -mb-48 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white mb-12">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl">Lumina Edu</span>
          </div>
          
          <div className="max-w-md">
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Empower Your Learning with AI Intelligence
            </h2>
            <p className="text-indigo-100 text-lg mb-8">
              Join thousands of students and teachers using Lumina Edu to transform education through native PDF understanding and intelligent tutoring.
            </p>
            
            <div className="space-y-4">
              {[
                'AI-Powered PDF Understanding',
                'Instant Presentation Generation',
                'Personalized Student Tutoring',
                'Interactive Quiz System'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-indigo-50">
                  <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-indigo-200 text-sm">
          © 2026 Lumina Edu. All rights reserved.
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full"
        >
          <Logo />

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800">
            <AnimatePresence mode="wait">
              {mode === 'reset-sent' ? (
                <motion.div
                  key="reset-sent"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-4"
                >
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Check your email</h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-8">
                    We've sent a password reset link to <span className="font-semibold text-slate-900 dark:text-white">{email}</span>.
                  </p>
                  <button
                    onClick={() => setMode('login')}
                    className="w-full py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all"
                  >
                    Back to Login
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {mode === 'signup' ? 'Create an Account' : mode === 'forgot-password' ? 'Reset Password' : 'Welcome Back'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                      {mode === 'signup' 
                        ? 'Join Lumina Edu to start your journey' 
                        : mode === 'forgot-password' 
                          ? 'Enter your email to receive a reset link' 
                          : 'Sign in to access your learning dashboard'}
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 rounded-2xl text-sm flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {mode === 'signup' && (
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <button
                          type="button"
                          onClick={() => setRole('student')}
                          className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                            role === 'student' 
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' 
                              : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <GraduationCap className="w-5 h-5" />
                          <span className="text-xs font-bold uppercase tracking-wider">Student</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setRole('teacher')}
                          className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                            role === 'teacher' 
                              ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                              : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <Presentation className="w-5 h-5" />
                          <span className="text-xs font-bold uppercase tracking-wider">Teacher</span>
                        </button>
                      </div>
                    )}

                    {mode === 'signup' && (
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>

                    {mode !== 'forgot-password' && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between ml-1">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                          {mode === 'login' && (
                            <button 
                              type="button"
                              onClick={() => setMode('forgot-password')}
                              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                              Forgot password?
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400" />
                          </div>
                          <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-3.5 px-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 ${
                        mode === 'signup' 
                          ? (role === 'teacher' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20')
                          : 'bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 shadow-slate-900/20 dark:shadow-indigo-500/20'
                      }`}
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : mode === 'signup' ? (
                        <UserPlus className="w-5 h-5" />
                      ) : mode === 'forgot-password' ? (
                        <Mail className="w-5 h-5" />
                      ) : (
                        <LogIn className="w-5 h-5" />
                      )}
                      {isLoading ? 'Processing...' : mode === 'signup' ? 'Create Account' : mode === 'forgot-password' ? 'Send Reset Link' : 'Sign In'}
                    </button>
                  </form>
                  
                  <div className="mt-8 text-center">
                    {mode === 'forgot-password' ? (
                      <button 
                        onClick={() => setMode('login')} 
                        className="flex items-center gap-2 mx-auto text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to login
                      </button>
                    ) : (
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button 
                          onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')} 
                          className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                        >
                          {mode === 'signup' ? 'Sign in' : 'Sign up for free'}
                        </button>
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const AlertCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);
