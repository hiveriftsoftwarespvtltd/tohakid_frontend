import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Mail, Lock, Phone, Eye, EyeOff, User, ArrowRight, ShieldCheck,
  Award, Star, CheckCircle2
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import Logo from '../components/Logo';
import slider1 from '../assets/slider1.png';

export default function LoginPage() {
  const { isLoggedIn, user, loginUser, signupUser, showToast } = useShop();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to profile or previous page if already logged in
  React.useEffect(() => {
    if (isLoggedIn) {
      const from = location.state?.from?.pathname || '/profile';
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, location]);

  // Mode: 'login' or 'signup'
  const isInitialSignup = location.pathname.includes('signup');
  const [authMode, setAuthMode] = useState(isInitialSignup ? 'signup' : 'login');

  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [parentChoice, setParentChoice] = useState('Both');

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Submit Login (ONLY Email & Password)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 4) {
      showToast('Please enter your password.');
      return;
    }
    const res = await loginUser(email, password);
    if (res?.success) {
      const from = location.state?.from?.pathname || '/profile';
      navigate(from, { replace: true });
    }
  };

  // Submit Signup (Name, Email, Mobile Number, Password)
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter your full name.');
      return;
    }
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.');
      return;
    }
    if (!phone || phone.length < 10) {
      showToast('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!password || password.length < 6) {
      showToast('Password must be at least 6 characters.');
      return;
    }
    if (!agreeTerms) {
      showToast('Please agree to the Terms of Service & Privacy Policy.');
      return;
    }
    const res = await signupUser({ name, email, phone, password });
    if (res && res.success) {
      Swal.fire({
        title: '🎉 Registration Successful!',
        text: 'Your account has been created successfully. Please log in with your credentials.',
        icon: 'success',
        confirmButtonColor: '#E91E63',
        confirmButtonText: 'Go to Login',
      }).then(() => {
        setPassword('');
        setAuthMode('login');
        navigate('/login');
      });
    }
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-pink-50/50 via-white to-pink-50/30 py-8 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl border border-pink-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">

        {/* LEFT COLUMN: Luxury Visual Brand Showcase */}
        <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-8 bg-[#FFF0F5] overflow-hidden">
          <img
            src={slider1}
            alt="Tohay Kids Festive Collection"
            className="absolute inset-0 w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#8E1B46] via-[#D81B60]/75 to-pink-900/30" />

          {/* Top Logo */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-baseline font-black leading-none text-2xl text-white">
              <span className="text-pink-200">t</span>
              <span className="text-yellow-300">o</span>
              <span className="text-pink-200">h</span>
              <span className="text-sky-300">a</span>
              <span className="text-yellow-300">y</span>
              <span className="text-xs text-white/90 ml-1.5 uppercase tracking-widest font-mono font-bold">KIDS</span>
            </Link>
            <p className="text-xs text-pink-100/90 mt-1 font-medium">Crafted for Little Celebrations</p>
          </div>

          {/* Center Info */}
          <div className="relative z-10 space-y-4 my-auto py-8">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/30">
              <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Joined by 50,000+ Happy Parents</span>
            </div>

            <h2 className="font-heading font-extrabold text-2xl xl:text-3xl text-white leading-tight">
              Unlock Exclusive Festive Wear & Parent Rewards!
            </h2>

            <div className="space-y-2.5 text-xs text-pink-100/90 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Earn 200 Tohay Coins instantly on signup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>100% Soft Cotton Lining for kid's comfort</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Track orders & express doorstep delivery</span>
              </div>
            </div>
          </div>

          {/* Bottom Review */}
          <div className="relative z-10 bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-white text-xs space-y-1">
            <div className="flex items-center gap-1 text-amber-300">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-300" />
              ))}
            </div>
            <p className="text-[11px] italic text-pink-50 leading-relaxed">
              "Amazing quality kurtas & gowns for my kids. Very smooth checkout!"
            </p>
            <p className="text-[10px] font-bold text-pink-200 uppercase tracking-wider">— Priyanka M., Delhi</p>
          </div>
        </div>

        {/* RIGHT COLUMN: Auth Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between">

          <div>
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center text-center mb-6">
              <Logo size="normal" />
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center justify-center p-1 bg-pink-50/80 rounded-2xl border border-pink-100 max-w-xs mx-auto mb-6">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${authMode === 'login'
                    ? 'bg-white text-[#D81B60] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${authMode === 'signup'
                    ? 'bg-white text-[#D81B60] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Create Account
              </button>
            </div>

            {/* Subtitle */}
            <div className="text-center mb-6 space-y-1">
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-gray-900">
                {authMode === 'login' ? 'Parent Sign In' : 'Create New Parent Account'}
              </h2>
              <p className="text-xs text-gray-500">
                {authMode === 'login'
                  ? 'Enter your email & password to access your account'
                  : 'Register with your name, email & mobile number'}
              </p>
            </div>

            {/* 1. LOGIN FORM (EMAIL ONLY) */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                    Email Address
                  </label>
                  <div className="relative mt-1">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="e.g. ananya.sharma@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] font-bold text-[#D81B60] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative mt-1">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember-login"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 border-gray-300"
                  />
                  <label htmlFor="remember-login" className="text-xs text-gray-600 font-medium cursor-pointer">
                    Remember me on this browser
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#D81B60] hover:bg-[#C2185B] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Sign In To Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* 2. SIGNUP FORM (NAME, EMAIL, MOBILE, PASSWORD) */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                    Full Name <span className="text-pink-600">*</span>
                  </label>
                  <div className="relative mt-1">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Ananya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                      Email Address <span className="text-pink-600">*</span>
                    </label>
                    <div className="relative mt-1">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="ananya@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                      Mobile Number <span className="text-pink-600">*</span>
                    </label>
                    <div className="relative mt-1">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                    Password <span className="text-pink-600">*</span>
                  </label>
                  <div className="relative mt-1">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider block mb-1">
                    Shopping Primarily For
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Girl 🎀', 'Boy 🧢', 'Both ✨'].map((opt) => {
                      const val = opt.split(' ')[0];
                      const isSel = parentChoice === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setParentChoice(val)}
                          className={`py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${isSel
                              ? 'bg-pink-100 text-[#D81B60] border-pink-300 shadow-2xs'
                              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms-check-register"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-pink-600 focus:ring-pink-500 border-gray-300"
                  />
                  <label htmlFor="terms-check-register" className="text-[11px] text-gray-600 leading-tight">
                    I agree to Tohay Kids' <span className="text-[#D81B60] font-bold">Terms of Service</span> & <span className="text-[#D81B60] font-bold">Privacy Policy</span>.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#D81B60] hover:bg-[#C2185B] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
                >
                  <span>Register & Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Footer Security Highlights */}
          <div className="pt-6 border-t border-gray-100 text-center flex items-center justify-center gap-4 text-[11px] text-gray-500 font-semibold mt-4">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-pink-600" /> 100% Safe & Secure</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-amber-600" /> Verified Brand</span>
          </div>

        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowForgotModal(false)} />
          <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full z-10 space-y-4 shadow-2xl">
            <h3 className="font-heading font-extrabold text-lg text-gray-900">Reset Password</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Enter your registered email address below to receive password reset instructions.
            </p>
            <div>
              <label className="text-[11px] font-bold text-gray-700">Registered Email</label>
              <input
                type="email"
                placeholder="ananya@gmail.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs mt-1"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (forgotEmail && forgotEmail.includes('@')) {
                    showToast(`Password reset link sent to ${forgotEmail}!`);
                    setShowForgotModal(false);
                    setForgotEmail('');
                  } else {
                    showToast('Please enter a valid email address.');
                  }
                }}
                className="flex-1 py-2.5 bg-[#D81B60] text-white text-xs font-extrabold rounded-xl shadow-xs"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
