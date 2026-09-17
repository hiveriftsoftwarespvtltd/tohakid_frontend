import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import { authService } from '../../services/authService';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Credentials',
        text: 'Please enter both Admin Email and Password.',
        confirmButtonColor: '#D81B60',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await authService.adminLogin({ email: email.trim(), password });
      const token = res?.data?.accessToken || res?.accessToken;
      const user = res?.data?.user || res?.user;

      if (token) {
        localStorage.setItem('tohay_admin_token', token);
        localStorage.setItem('tohay_access_token', token);
        localStorage.setItem('tohay_admin_user', JSON.stringify(user || { email, role: 'ADMIN' }));

        await Swal.fire({
          icon: 'success',
          title: 'Access Granted!',
          text: 'Welcome back, Administrator.',
          timer: 1500,
          showConfirmButton: false,
        });

        navigate('/admin');
      } else {
        throw new Error('Invalid token response from server.');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Invalid Admin Email or Password.';
      Swal.fire({
        icon: 'error',
        title: 'Authentication Failed',
        text: errorMsg,
        confirmButtonColor: '#D81B60',
      });
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-pink-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-500/20 p-8 sm:p-10 space-y-8 relative overflow-hidden">
        {/* Decorative Top Ambient Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#D81B60]/30 rounded-full blur-2xl pointer-events-none" />

        {/* Header Branding */}
        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-[#D81B60] to-pink-500 text-white rounded-2xl shadow-lg shadow-pink-500/30 mb-2 transform hover:scale-105 transition-transform">
            <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-gray-900 tracking-tight">
            Tohay ADMIN <span className="text-[#D81B60]">Portal</span>
          </h1>
          <p className="text-xs text-gray-500 font-semibold">
            Authorized Personnel & Store Management Access
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAdminLogin} className="space-y-5 relative z-10">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tohaykids.com"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-[#D81B60] focus:ring-2 focus:ring-pink-100 transition-all outline-none"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-[#D81B60] focus:ring-2 focus:ring-pink-100 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D81B60] p-1 cursor-pointer focus:outline-none transition-colors"
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#D81B60] to-pink-600 hover:from-pink-700 hover:to-[#D81B60] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-pink-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Login To Master Control</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
