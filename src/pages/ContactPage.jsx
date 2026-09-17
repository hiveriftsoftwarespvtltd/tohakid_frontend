import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Phone, Mail, MapPin, Send, MessageCircle, Clock, ChevronDown, CheckCircle2, PackageCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { usePageBanner } from '../utils/usePageBanner';
import arrivehero from '../assets/arrivehero.png';

export default function ContactPage() {
  const heroBanner = usePageBanner('Contact Us Hero Banner', 'Contact Us', "We're here to help you find the perfect outfit for your little one.", arrivehero);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Sizing & Fit Advice',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormState({ name: '', email: '', phone: '', subject: 'Sizing & Fit Advice', message: '' });
    setTimeout(() => setSubmitted(false), 6000);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'How do I choose the right size for my child?',
      a: 'We provide age-appropriate sizing charts (0-8Y, 9-12Y, 13-16Y) with exact chest, waist, and length measurements on every product page. If your child is between sizes, we recommend opting for the larger size for maximum comfort.'
    },
    {
      q: 'What is your return & exchange policy?',
      a: 'We offer a hassle-free 7-day return and exchange policy from the date of delivery. Items must be unused, unwashed, and in their original packaging with tags intact.'
    },
    {
      q: 'How long does shipping take across India?',
      a: 'Standard delivery takes 3 to 5 business days for major metro cities and 5 to 7 days for rest of India. Express shipping is also available at checkout for urgent festive orders.'
    },
    {
      q: 'Do you offer custom tailoring for sibling matching outfits?',
      a: 'Yes! Our Tohay Design Studio specializes in custom color coordination and custom fitting for Brother & Sister lehenga & kurta sets. Connect directly with our styling concierge on WhatsApp.'
    }
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500">
        <Link to="/" className="hover:text-[#D81B60] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[#D81B60] font-bold">Contact Us</span>
      </nav>

      {/* 1. Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-pink-200/60 shadow-2xs min-h-[260px] sm:min-h-[300px] md:min-h-[340px] flex items-center bg-[#FFF0F5]">
        <img
          src={heroBanner.image}
          alt={heroBanner.title}
          className="absolute inset-0 w-full h-full object-cover object-right"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF0F5] via-[#FFF0F5]/95 to-transparent w-full md:w-3/5" />

        <div className="relative z-10 p-6 sm:p-8 md:p-12 max-w-xl space-y-3">
          <h1 className="font-sans font-bold md:font-extrabold text-4xl sm:text-5xl md:text-6xl text-[#1E293B] tracking-tight leading-none">
            {heroBanner.title}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#64748B] font-medium leading-relaxed pt-1">
            {heroBanner.subtitle}
          </p>
          <div className="flex items-center gap-2 text-[#D81B60] opacity-60 pt-1">
            <div className="w-12 h-0.5 bg-[#D81B60] rounded-full" />
          </div>
        </div>
      </div>

      {/* 2. Top 3 Contact Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: WhatsApp & Call */}
        <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-sans font-extrabold text-lg text-gray-900">WhatsApp & Call Support</h3>
              <p className="text-xs text-gray-500 mt-1">Sizing help & instant order updates</p>
            </div>
            <div className="pt-1">
              <span className="font-sans font-extrabold text-xl text-emerald-600 block">+91 98765 43210</span>
              <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1 mt-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" /> Mon - Sat: 10:00 AM - 7:00 PM IST
              </span>
            </div>
          </div>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Card 2: Email Support */}
        <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#D81B60] flex items-center justify-center shrink-0 shadow-2xs">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-sans font-extrabold text-lg text-gray-900">Email Care</h3>
              <p className="text-xs text-gray-500 mt-1">24/7 priority response inbox</p>
            </div>
            <div className="pt-1">
              <span className="font-sans font-extrabold text-lg text-[#D81B60] block">support@tohaykids.com</span>
              <span className="text-[11px] text-gray-500 font-medium block mt-1">
                Average reply time: within 2 hours
              </span>
            </div>
          </div>
          <a
            href="mailto:support@tohaykids.com"
            className="w-full bg-[#D81B60] hover:bg-[#C2185B] text-white font-extrabold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Send Email</span>
          </a>
        </div>

        {/* Card 3: Design Studio */}
        <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-sans font-extrabold text-lg text-gray-900">Visit Our Studio</h3>
              <p className="text-xs text-gray-500 mt-1">Experience our fabrics in person</p>
            </div>
            <div className="pt-1 text-xs text-gray-600 font-medium leading-relaxed">
              <span className="font-extrabold text-gray-900 block">Tohay Kids Design Studio</span>
              <span>Sector 18, Gurugram, Haryana 122008</span>
            </div>
          </div>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noreferrer"
            className="w-full bg-gray-900 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span>Get Directions</span>
          </a>
        </div>
      </div>

      {/* 3. Form & Live WhatsApp Assistant Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-2xs space-y-6">
          <div className="space-y-1">
            <h3 className="font-sans font-extrabold text-2xl text-[#1E293B]">Send Us a Message</h3>
            <p className="text-xs text-gray-500 font-medium">
              Fill in your details and our kids styling concierge will get back to you within 2 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-extrabold text-gray-800 block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D81B60] focus:bg-white text-gray-800 font-semibold"
                />
              </div>

              <div>
                <label className="font-extrabold text-gray-800 block mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formState.phone}
                  onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D81B60] focus:bg-white text-gray-800 font-semibold font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-extrabold text-gray-800 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="priya@domain.com"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D81B60] focus:bg-white text-gray-800 font-semibold"
                />
              </div>

              <div>
                <label className="font-extrabold text-gray-800 block mb-1">Subject *</label>
                <select
                  value={formState.subject}
                  onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D81B60] focus:bg-white text-gray-800 font-semibold"
                >
                  <option value="Sizing & Fit Advice">Sizing & Fit Advice</option>
                  <option value="Order Status & Delivery">Order Status & Delivery</option>
                  <option value="Custom Sibling Outfit Order">Custom Sibling Outfit Order</option>
                  <option value="Returns & Exchange">Returns & Exchange</option>
                  <option value="Bulk / Wholesale Inquiry">Bulk / Wholesale Inquiry</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-extrabold text-gray-800 block mb-1">How Can We Help You? *</label>
              <textarea
                rows={4}
                required
                placeholder="Tell us about your requirements or question..."
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D81B60] focus:bg-white text-gray-800 font-semibold"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#D81B60] hover:bg-[#C2185B] text-white font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>SEND MESSAGE</span>
            </button>
          </form>

          {submitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 font-extrabold text-xs rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Thank you! Your message has been sent successfully. Our team will contact you within 2 hours.</span>
            </div>
          )}
        </div>

        {/* Right Side Widgets (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live WhatsApp Concierge Widget */}
          <div className="bg-gradient-to-br from-emerald-50 to-pink-50/50 p-6 rounded-3xl border border-emerald-200/80 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>ONLINE NOW • RESPOUNDS IN &lt; 5 MINS</span>
            </div>

            <div className="space-y-1">
              <h4 className="font-sans font-extrabold text-xl text-gray-900">Need Sizing Help Right Now?</h4>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Our kids ethnic wear specialists are online on WhatsApp to share real photos, video fabric preview, and precise size recommendations.
              </p>
            </div>

            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-2xs transition-colors w-full justify-center"
            >
              <MessageCircle className="w-4 h-4" />
              <span>START WHATSAPP CHAT</span>
            </a>
          </div>

          {/* Quick Track Order Widget */}
          <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#D81B60] flex items-center justify-center shrink-0 shadow-2xs">
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-sans font-extrabold text-base text-gray-900">Already Placed an Order?</h4>
                <p className="text-xs text-gray-500 font-medium">Track live shipping and delivery status</p>
              </div>
            </div>
            <Link
              to="/track-order"
              className="w-full bg-gray-50 hover:bg-gray-100 text-[#D81B60] font-extrabold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 border border-pink-100 transition-colors block text-center"
            >
              <span>TRACK YOUR ORDER</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. FAQ Accordion Section */}
      <div className="space-y-6 pt-4 border-t border-gray-200">
        <div className="text-center space-y-1.5">
          <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-[#1E293B]">
            Frequently Asked Questions
          </h2>
          <div className="flex items-center justify-center text-[#D81B60] opacity-60">
            <div className="w-12 h-0.5 bg-[#D81B60] rounded-full" />
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-extrabold text-xs sm:text-sm text-gray-900 hover:text-[#D81B60] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#D81B60]' : 'text-gray-400'}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-gray-600 leading-relaxed font-normal border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
