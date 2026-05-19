import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, User, Mail, Lock, ArrowRight } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(username, email, password);
      navigate('/login', { state: { message: 'Registration successful! Welcome to the loop.' } });
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-radial from-[#1e1b4b] via-[#0f172a] to-[#090d16] p-4 relative overflow-hidden">
      {/* Cinematic Ambient Background Blur Highlights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container Shell */}
      <div className="w-full max-w-md backdrop-blur-xl bg-slate-900/40 p-8 rounded-2xl shadow-[0_0_50px_0_rgba(0,0,0,0.5)] border border-slate-800/60 relative group transition-all duration-500 hover:border-indigo-500/20">
        
        {/* Animated Accent Top Lip Border Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-[1px]" />

        {/* Brand Header Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3.5 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl mb-4 shadow-xl shadow-indigo-500/20 relative group-hover:scale-105 transition-transform duration-300">
            <MessageSquare className="w-7 h-7 text-white" />
            <div className="absolute inset-0 bg-white/20 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300 pointer-events-none" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Create Account
          </h1>
          <p className="text-slate-400 text-sm mt-1.5 font-medium">Get started with SyncTalk today</p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1.5 ml-1">Username</label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm group-hover:border-slate-700/80"
                placeholder="alex_dev"
              />
            </div>
          </div>

          {/* Email Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1.5 ml-1">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm group-hover:border-slate-700/80"
                placeholder="alex@synctalk.com"
              />
            </div>
          </div>

          {/* Password Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1.5 ml-1">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm group-hover:border-slate-700/80"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          {/* Premium Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 active:scale-[0.99] transition-all text-sm mt-3 flex items-center justify-center gap-2 group/btn cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 font-medium mt-6">
          Already verified?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors font-semibold">
            Log In here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;