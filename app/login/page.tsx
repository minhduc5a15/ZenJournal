'use client';

import React, { useState } from 'react';
import { login, register } from '@/services/api';
import { BookOpen, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login: storeLogin } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = isRegister 
        ? await register(email, password, name)
        : await login(email, password);
      storeLogin(user);
      router.push('/');
    } catch (err: unknown) {
      setError((err instanceof Error) ? err.message : 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FDFCF8] dark:bg-stone-950 selection:bg-rose-100 dark:selection:bg-rose-900 selection:text-rose-900 dark:selection:text-rose-100">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-stone-900 overflow-hidden text-white items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-rose-950/40 z-10" />
        <img 
            src="https://images.unsplash.com/photo-1499750310159-5b5f38e31639?q=80&w=2520&auto=format&fit=crop" 
            alt="Calm Desk" 
            className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay scale-105"
        />
        <div className="relative z-20 max-w-lg space-y-8">
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
             >
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-6">
                    <BookOpen className="w-5 h-5 text-rose-200" />
                    <span className="text-sm font-medium tracking-wide text-rose-100">ZenJournal</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-serif font-bold leading-[1.1] tracking-tight">
                    Quiet your mind.<br/>Find your focus.
                </h1>
             </motion.div>
            
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-stone-300 text-lg font-light leading-relaxed max-w-md"
            >
                A minimalist sanctuary for your daily thoughts. Distraction-free writing, mood tracking, and secure reflection.
            </motion.p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-[#FDFCF8] dark:bg-stone-950">
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md space-y-8 bg-white dark:bg-stone-900 p-8 sm:p-10 rounded-3xl shadow-xl shadow-stone-200/50 dark:shadow-none border border-stone-100 dark:border-stone-800"
        >
            <div className="text-center">
                <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                    {isRegister ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="mt-3 text-stone-500 dark:text-stone-400 text-sm">
                    {isRegister ? 'Start your journaling journey today.' : 'Enter your credentials to access your space.'}
                </p>
            </div>

            <AnimatePresence mode="wait">
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-sm border border-rose-100 dark:border-rose-900/30"
                    >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence>
                    {isRegister && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-1 overflow-hidden"
                        >
                            <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 ml-1">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:border-stone-400 dark:focus:border-stone-500 focus:bg-white dark:focus:bg-stone-800 focus:ring-4 focus:ring-stone-100 dark:focus:ring-stone-800 outline-none transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500"
                                placeholder="e.g. Jane Doe"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 ml-1">Email Address</label>
                    <input
                        type="email"
                        required
                        className="w-full px-4 py-3.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:border-stone-400 dark:focus:border-stone-500 focus:bg-white dark:focus:bg-stone-800 focus:ring-4 focus:ring-stone-100 dark:focus:ring-stone-800 outline-none transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500"
                        placeholder="name@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 ml-1">Password</label>
                    <input
                        type="password"
                        required
                        className="w-full px-4 py-3.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:border-stone-400 dark:focus:border-stone-500 focus:bg-white dark:focus:bg-stone-800 focus:ring-4 focus:ring-stone-100 dark:focus:ring-stone-800 outline-none transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 py-4 rounded-xl font-bold tracking-wide hover:bg-stone-800 dark:hover:bg-stone-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 hover:-translate-y-0.5 shadow-lg hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
                >
                    {loading ? (
                         <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 dark:border-stone-900/30 border-t-white dark:border-t-stone-900 rounded-full animate-spin"/> Processing...</span>
                    ) : (
                        <span className="flex items-center gap-2">
                             {isRegister ? 'Sign Up' : 'Sign In'} <ArrowRight className="w-4 h-4" />
                        </span>
                    )}
                </button>
            </form>

            <div className="text-center pt-2">
                <button 
                    onClick={() => { setIsRegister(!isRegister); setError(''); }}
                    className="text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 text-sm font-medium transition-colors"
                >
                    {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
            </div>
        </motion.div>
      </div>
    </div>
  );
}
