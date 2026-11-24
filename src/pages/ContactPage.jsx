import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, Phone, Mail, Clock, Send,
  MessageCircle, CheckCircle2, Truck, ShieldCheck, Heart
} from 'lucide-react';

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Sizing & Fit Advice',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormState({
      name: '',
      email: '',
      phone: '',
      subject: 'Sizing & Fit Advice',
      message: ''
    });
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 font-sans">
      
      {/* 1. Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500">
        <Link to="/" className="hover:text-[#D81B60] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[#D81B60] font-bold">Contact Us</span>
      </nav>

      {/* 2. Soft, Elegant Page Header */}
      <div className="space-y-2 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-200/80 text-[#D81B60] text-xs font-bold uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5 fill-[#D81B60]" />
          <span>Customer Concierge</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 tracking-tight">
          Get in Touch with Tohay Kids
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
          Have a question about sizes, fabrics, festive styling, or your order? We are always happy to assist you.
        </p>
      </div>

      {/* 3. Main 2-Column Section: Info on Left & Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start pt-2">
        
        {/* LEFT COLUMN: Contact & Concierge Information (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-pink-100/90 shadow-xs space-y-6">
          <div className="space-y-1 border-b border-pink-100 pb-4">
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-800">
              Customer Support Channels
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-normal">
              Direct assistance for sizing, styling, and deliveries
            </p>
          </div>

          {/* Contact Details List */}
          <div className="space-y-5">
            {/* Phone & WhatsApp Support */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <Phone className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] uppercase tracking-wider font-bold text-gray-600 block">
                  Call & WhatsApp
                </span>
                <a
                  href="https://wa.me/919261874142"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-extrabold text-emerald-600 hover:text-emerald-700 block transition-colors"
                >
                  +91 92618 74142
                </a>
                <p className="text-xs text-gray-600 flex items-center gap-1.5 pt-0.5 font-normal">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Mon – Sat: 10:00 AM – 7:00 PM IST</span>
                </p>
              </div>
            </div>

            {/* Direct WhatsApp Action Button */}
            <div className="pl-13.5">
              <a
                href="https://wa.me/919261874142"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-xs transition-all hover:scale-102"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Email Support */}
            <div className="flex items-start gap-3.5 pt-1">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#D81B60] flex items-center justify-center shrink-0 border border-pink-100">
                <Mail className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] uppercase tracking-wider font-bold text-gray-600 block">
                  Email Support
                </span>
                <a
                  href="mailto:tohaykids@gmail.com"
                  className="text-base font-extrabold text-[#D81B60] hover:text-[#C2185B] block transition-colors"
                >
                  tohaykids@gmail.com
                </a>
                <p className="text-xs text-gray-600 font-normal">
                  tohaykids@gmail.com • Response within 2–4 hours
                </p>
              </div>
            </div>

            {/* Pan-India Express Delivery */}
            <div className="flex items-start gap-3.5 pt-1">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                <Truck className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] uppercase tracking-wider font-bold text-gray-600 block">
                  Pan-India Shipping
                </span>
                <p className="text-sm font-bold text-gray-800">
                  Express Delivery in 3–5 Business Days
                </p>
                <p className="text-xs text-gray-600 font-normal">
                  Insured doorstep dispatch across 28,000+ pin codes
                </p>
              </div>
            </div>

            {/* Order Assurance */}
            <div className="flex items-start gap-3.5 pt-1">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] uppercase tracking-wider font-bold text-gray-600 block">
                  Parent Promise
                </span>
                <p className="text-sm font-bold text-gray-800">
                  7-Day Hassle-Free Size Exchange
                </p>
                <p className="text-xs text-gray-600 font-normal">
                  100% skin-safe mulmul linings on every outfit
                </p>
              </div>
            </div>
          </div>

          {/* Social Channels with Authentic Vibrant Brand Colors (NO GRAY) */}
          <div className="pt-4 border-t border-pink-100 space-y-3">
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
              Follow Us on Social Media
            </span>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/tohay_kids?stkn=ZDhxaG9lamJuajN3"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white rounded-full flex items-center justify-center shadow-xs hover:scale-110 transition-transform"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#1877F2] text-white rounded-full flex items-center justify-center shadow-xs hover:scale-110 transition-transform"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#FF0000] text-white rounded-full flex items-center justify-center shadow-xs hover:scale-110 transition-transform"
                aria-label="Youtube"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Contact Form with Clean Labels and Inputs (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-pink-100/90 shadow-xs space-y-6">
          <div className="space-y-1 border-b border-pink-100 pb-4">
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-800">
              Send Us a Message
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-normal">
              Fill in your details below and our team will get in touch shortly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-sm">
            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Full Name <span className="text-[#D81B60] font-normal">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-4 py-3.5 bg-pink-50/20 hover:bg-white focus:bg-white border border-pink-100 focus:border-[#D81B60] focus:ring-3 focus:ring-pink-50 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 font-normal transition-all outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Mobile Number <span className="text-[#D81B60] font-normal">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 92618 74142"
                  value={formState.phone}
                  onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                  className="w-full px-4 py-3.5 bg-pink-50/20 hover:bg-white focus:bg-white border border-pink-100 focus:border-[#D81B60] focus:ring-3 focus:ring-pink-50 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 font-normal transition-all outline-none"
                />
              </div>
            </div>

            {/* Email & Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Email Address <span className="text-[#D81B60] font-normal">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="priya@example.com"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full px-4 py-3.5 bg-pink-50/20 hover:bg-white focus:bg-white border border-pink-100 focus:border-[#D81B60] focus:ring-3 focus:ring-pink-50 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 font-normal transition-all outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Subject <span className="text-[#D81B60] font-normal">*</span>
                </label>
                <select
                  value={formState.subject}
                  onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                  className="w-full px-4 py-3.5 bg-pink-50/20 hover:bg-white focus:bg-white border border-pink-100 focus:border-[#D81B60] focus:ring-3 focus:ring-pink-50 rounded-xl text-sm text-gray-800 font-normal transition-all outline-none cursor-pointer"
                >
                  <option value="Sizing & Fit Advice">Sizing & Fit Advice</option>
                  <option value="Order Status & Delivery">Order Status & Delivery</option>
                  <option value="Sibling Matching Sets Inquiry">Sibling Matching Sets Inquiry</option>
                  <option value="Returns & Exchanges">Returns & Exchanges</option>
                  <option value="Custom Bulk Inquiry">Custom Bulk Inquiry</option>
                  <option value="General Question">General Question</option>
                </select>
              </div>
            </div>

            {/* Message Area */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                How Can We Help You? <span className="text-[#D81B60] font-normal">*</span>
              </label>
              <textarea
                rows={5}
                required
                placeholder="Write your question, child's age, or specific outfit requirement here..."
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="w-full px-4 py-3.5 bg-pink-50/20 hover:bg-white focus:bg-white border border-pink-100 focus:border-[#D81B60] focus:ring-3 focus:ring-pink-50 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 font-normal transition-all outline-none resize-y"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#D81B60] hover:bg-[#C2185B] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-99"
            >
              <Send className="w-4 h-4" />
              <span>SEND MESSAGE</span>
            </button>
          </form>

          {/* Success Message Banner */}
          {submitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200/70 text-emerald-800 font-medium text-xs sm:text-sm rounded-2xl flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Thank you! Your message has been received. Our concierge team will reach out to you within 2 hours.</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
