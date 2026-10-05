import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, Award, Feather, ShieldCheck, Truck, Users,
  Star, Heart, RotateCcw, Lock, Clock, ArrowRight, Ruler,
  MessageCircle, Crown, CheckCircle2
} from 'lucide-react';
import { usePageBanner } from '../utils/usePageBanner';
import cc from '../assets/cc.png';
import newArrivalsMobileImg from '../assets/newarrives.png';
import three from '../assets/three.png';

export default function AboutPage() {
  const heroBanner = usePageBanner(
    'About Us Hero Banner',
    'About Us',
    'Made for little celebrations, crafted with love.',
    cc,
    '/about-us',
    newArrivalsMobileImg
  );

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-16 sm:space-y-24 font-sans">
      
      {/* 1. Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500">
        <Link to="/" className="hover:text-[#D81B60] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[#D81B60] font-bold">About Tohay Kids</span>
      </nav>

      {/* 2. Top Hero Header Banner (Admin-Controlled & High-Res) */}
      <section className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-pink-100 shadow-sm aspect-square sm:aspect-auto sm:h-[420px] md:h-[480px] lg:h-[520px] bg-[#FFF5F7] select-none">
        <picture className="absolute inset-0 w-full h-full block">
          <source
            media="(max-width: 640px)"
            srcSet={heroBanner.mobileImage || newArrivalsMobileImg}
          />
          <img
            src={heroBanner.image}
            alt={heroBanner.title}
            className="w-full h-full object-cover object-center"
          />
        </picture>
      </section>

      {/* 3. The Brand Manifesto (Modern Clean Sans-Serif Opening) */}
      <section className="text-center max-w-4xl mx-auto space-y-4 px-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 border border-pink-200/80 text-[#D81B60] text-xs font-bold uppercase tracking-widest">
          <Heart className="w-3.5 h-3.5 fill-[#D81B60]" />
          <span>The Tohay Heritage</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
          Where Childhood Innocence Meets <br className="hidden sm:inline" />
          <span className="text-[#D81B60]">Timeless Indian Craft</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-gray-600 font-normal leading-relaxed max-w-2xl mx-auto">
          We believe festivals are made of laughter, family rituals, and carefree dancing. Every outfit we design is created so your child feels completely joyful, comfortable, and beautifully celebrated.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <span className="w-12 h-px bg-pink-200" />
          <Crown className="w-4 h-4 text-[#D81B60]" />
          <span className="w-12 h-px bg-pink-200" />
        </div>
      </section>

      {/* 4. The Origin Story (Clean Two-Column Modern Layout) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Left Column: Framed Photography */}
        <div className="lg:col-span-6">
          <div className="relative rounded-3xl p-2.5 sm:p-3 bg-white border border-pink-100 shadow-md">
            <div className="rounded-2xl overflow-hidden bg-[#FFF5F7]">
              <img
                src={three}
                alt="Tohay Kids Happy Children in Festive Attire"
                className="w-full h-[400px] sm:h-[480px] lg:h-[540px] object-cover object-top"
              />
            </div>
            
            {/* Subtle Archival Tag */}
            <div className="absolute bottom-6 left-6 right-6 sm:right-auto bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-pink-100 shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-pink-50 text-[#D81B60] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 leading-none">100% Skin-Safe Lining</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Gentle combed mulmul cotton</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Thoughtful Prose */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D81B60]">The Tohay Story</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-snug">
              Say Goodbye to Heavy, Itchy Festive Wear
            </h2>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
            <p>
              For decades, children’s ethnic wear presented parents with a frustrating compromise. The garments looked stunning in family photographs, but on the inside, rough synthetic backings, scratchy zari threads, and stiff seams left kids restless, uncomfortable, and wanting to change within minutes.
            </p>
            <p>
              <strong className="text-gray-900 font-semibold">Tohay Kids</strong> was founded to solve this dilemma once and for all. We re-engineered traditional Indian silhouettes—from graceful Alia Kurtis and Shararas to dapper Kurta-Dhoti sets—crafting them with second-skin soft mulmul linings, breathable textiles, and generous movement allowances.
            </p>
            <p>
              The result? Regal Indian ethnic wear that feels as gentle and relaxed as your child's favorite cotton playtime clothes.
            </p>
          </div>

          {/* Two Key Architectural Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#FFF8FA] border border-pink-100 space-y-1">
              <div className="flex items-center gap-2 text-[#D81B60]">
                <Feather className="w-4 h-4" />
                <span className="font-bold text-xs sm:text-sm text-gray-900">Zero-Itch Guarantee</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed font-normal">
                Every stitch touching tender skin is lined with 100% pure mulmul.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FBF9FE] border border-purple-100 space-y-1">
              <div className="flex items-center gap-2 text-purple-600">
                <Ruler className="w-4 h-4" />
                <span className="font-bold text-xs sm:text-sm text-gray-900">+2" Growth Margins</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed font-normal">
                Concealed inner seam allowance ensures multi-season festive wear.
              </p>
            </div>
          </div>

          {/* CTA Links */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/girls"
              className="bg-[#D81B60] hover:bg-[#C2185B] text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2"
            >
              <span>Explore Girls Wear</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/boys"
              className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-2xs flex items-center gap-2"
            >
              <span>Explore Boys Wear</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. The Tohay Hallmark: 3 Pillars of Distinction (Spacious Modern Sans Layout) */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200/80 text-[#D81B60] text-xs font-bold uppercase tracking-widest">
            <Award className="w-3.5 h-3.5" />
            <span>The Tohay Standard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Craftsmanship Rooted in Child Comfort
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
            Three thoughtful design principles engineered into every single garment we tailor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Pillar 1 */}
          <div className="bg-white p-7 sm:p-8 rounded-3xl border border-pink-100 shadow-2xs hover:shadow-md transition-all space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#D81B60] flex items-center justify-center border border-pink-100">
                <Feather className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D81B60]">Zero-Scratch Philosophy</span>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">100% Soft Mulmul Lining</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                Indian festive wear is famed for intricate embellishments, but embroidery backings can irritate soft skin. At Tohay Kids, every interior surface that touches your child is shielded with pure, breathable combed cotton mulmul. Zero chafing, zero redness, pure celebration.
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100 flex items-center text-xs font-bold text-[#D81B60] gap-1.5">
              <span>Toddler & baby approved</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-7 sm:p-8 rounded-3xl border border-purple-100 shadow-2xs hover:shadow-md transition-all space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                <Ruler className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Smart Multi-Season Wear</span>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">+2" Growth Margins</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                Children grow in sudden spurts, but beautiful festive outfits shouldn't be worn only once. Our master pattern cutters conceal two full inches of extra fabric margin inside side seams and sleeve hems. As your child grows, a simple seam release extends the outfit for subsequent family celebrations.
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100 flex items-center text-xs font-bold text-purple-600 gap-1.5">
              <span>Effortless seam expansion</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-7 sm:p-8 rounded-3xl border border-amber-100 shadow-2xs hover:shadow-md transition-all space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <ShieldCheck className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Designed for Real Childhood</span>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Tantrum-Free Dressing</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                Getting ready on hectic festival mornings should be effortless. We incorporate smooth, child-safe snap closures, wide necklines, pre-stitched elasticated dhotis, and lightweight dupattas that stay comfortably anchored so children can run, twirl, and play completely unencumbered.
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100 flex items-center text-xs font-bold text-amber-600 gap-1.5">
              <span>Quick, fuss-free dressing</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. The Atelier Journey: Loom to Little Smiles (Horizontal 4-Step Process) */}
      <section className="bg-gradient-to-b from-[#FFFDFC] via-[#FFF8FA] to-[#FFFDFC] rounded-3xl p-6 sm:p-10 md:p-12 border border-pink-100 shadow-2xs space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D81B60]">The Atelier Process</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            From Traditional Loom to Little Smiles
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
            A meticulous four-stage craft journey ensuring every Tohay garment brings unmatched joy to your family.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-pink-100/80 shadow-2xs space-y-3 relative group hover:border-pink-300 transition-colors">
            <span className="text-3xl font-black text-pink-300 block">01</span>
            <h4 className="font-bold text-sm sm:text-base text-gray-900">Artisanal Sourcing</h4>
            <p className="text-xs text-gray-600 leading-relaxed font-normal">
              Selecting natural breathable cottons, chanderis, and silks from renowned weaver hubs across India, colored with gentle child-safe dyes.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-pink-100/80 shadow-2xs space-y-3 relative group hover:border-pink-300 transition-colors">
            <span className="text-3xl font-black text-pink-300 block">02</span>
            <h4 className="font-bold text-sm sm:text-base text-gray-900">Ergonomic Cutting</h4>
            <p className="text-xs text-gray-600 leading-relaxed font-normal">
              Precision pattern cuts crafted specifically for energetic kids, featuring relaxed armholes, roomy crotches, and flexible waists.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-pink-100/80 shadow-2xs space-y-3 relative group hover:border-pink-300 transition-colors">
            <span className="text-3xl font-black text-pink-300 block">03</span>
            <h4 className="font-bold text-sm sm:text-base text-gray-900">40-Point Seam Audit</h4>
            <p className="text-xs text-gray-600 leading-relaxed font-normal">
              Rigorous inspection of every internal seam, neckline border, and fastening to guarantee zero scratching and lasting durability.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-2xl border border-pink-100/80 shadow-2xs space-y-3 relative group hover:border-pink-300 transition-colors">
            <span className="text-3xl font-black text-pink-300 block">04</span>
            <h4 className="font-bold text-sm sm:text-base text-gray-900">Doorstep Delivery</h4>
            <p className="text-xs text-gray-600 leading-relaxed font-normal">
              Bespoke festive gift packaging dispatched express Pan-India to reach your doorstep within 3 to 5 business days.
            </p>
          </div>
        </div>
      </section>

      {/* 7. By The Numbers: Minimalist Sans-Serif Metrics Ribbon */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-pink-100 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-pink-100">
          <div className="space-y-1 pt-3 md:pt-0">
            <div className="w-10 h-10 rounded-full bg-pink-50 text-[#D81B60] flex items-center justify-center mx-auto mb-2 border border-pink-100">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-2xl sm:text-3xl text-gray-900">50,000+</h4>
            <p className="text-xs font-bold text-gray-800">Happy Celebrations</p>
            <p className="text-[11px] text-gray-500 font-normal">Across India & worldwide</p>
          </div>

          <div className="space-y-1 pt-3 md:pt-0">
            <div className="w-10 h-10 rounded-full bg-pink-50 text-[#D81B60] flex items-center justify-center mx-auto mb-2 border border-pink-100">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-2xl sm:text-3xl text-gray-900">28,000+</h4>
            <p className="text-xs font-bold text-gray-800">Pin Codes Served</p>
            <p className="text-[11px] text-gray-500 font-normal">Reliable Pan-India reach</p>
          </div>

          <div className="space-y-1 pt-3 md:pt-0">
            <div className="w-10 h-10 rounded-full bg-pink-50 text-[#D81B60] flex items-center justify-center mx-auto mb-2 border border-pink-100">
              <Star className="w-5 h-5 fill-[#D81B60]" />
            </div>
            <h4 className="font-extrabold text-2xl sm:text-3xl text-gray-900">4.9 / 5.0</h4>
            <p className="text-xs font-bold text-gray-800">Parent Love Score</p>
            <p className="text-[11px] text-gray-500 font-normal">Verified reviews</p>
          </div>

          <div className="space-y-1 pt-3 md:pt-0">
            <div className="w-10 h-10 rounded-full bg-pink-50 text-[#D81B60] flex items-center justify-center mx-auto mb-2 border border-pink-100">
              <Feather className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-2xl sm:text-3xl text-gray-900">100%</h4>
            <p className="text-xs font-bold text-gray-800">Pure Mulmul Touch</p>
            <p className="text-[11px] text-gray-500 font-normal">Zero synthetic inner contact</p>
          </div>

          <div className="space-y-1 pt-3 md:pt-0 col-span-2 md:col-span-1">
            <div className="w-10 h-10 rounded-full bg-pink-50 text-[#D81B60] flex items-center justify-center mx-auto mb-2 border border-pink-100">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-2xl sm:text-3xl text-gray-900">3–5 Days</h4>
            <p className="text-xs font-bold text-gray-800">Express Delivery</p>
            <p className="text-[11px] text-gray-500 font-normal">Fast doorstep transit</p>
          </div>
        </div>
      </section>

      {/* 8. Voices of Tohay Families (Curated Testimonial Showcase) */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200/80 text-[#D81B60] text-xs font-bold uppercase tracking-widest">
            <Star className="w-3.5 h-3.5 fill-[#D81B60]" />
            <span>Parent Testimonials</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Loved by Parents, Adored by Little Ones
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
            Real stories from families who trusted Tohay Kids for their most memorable occasions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Review 1 */}
          <div className="bg-white p-7 rounded-3xl border border-pink-100 shadow-2xs space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic font-normal">
                "My 4-year-old daughter wore the Alia Kurti Afgani set for Diwali. Usually she takes ethnic clothes off within minutes, but she wore this all day without a single complaint! The mulmul inner lining makes a tremendous difference."
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs sm:text-sm text-gray-900">Pooja Singhania</h5>
                <span className="text-[11px] text-gray-500 font-medium">Jaipur, Rajasthan • Verified Buyer</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-pink-50 text-[#D81B60] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="bg-white p-7 rounded-3xl border border-purple-100 shadow-2xs space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic font-normal">
                "The sibling matching Kurta and Lehenga set was the star of our family wedding in Udaipur. The colors were radiant in photographs, and the +2 inch margins allowed us to easily adjust the fit for our growing boy."
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs sm:text-sm text-gray-900">Ananya & Varun Rao</h5>
                <span className="text-[11px] text-gray-500 font-medium">Bengaluru, Karnataka • Verified Buyer</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="bg-white p-7 rounded-3xl border border-amber-100 shadow-2xs space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic font-normal">
                "Finding boys' ethnic wear that isn't stiff and itchy was nearly impossible until we ordered from Tohay. The Kurta and Dhoti set was breezy and exceptionally tailored. Arrived right on schedule in 4 days!"
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs sm:text-sm text-gray-900">Dr. Sneha Patel</h5>
                <span className="text-[11px] text-gray-500 font-medium">Ahmedabad, Gujarat • Verified Buyer</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. The 4 Tohay Promises to Parents */}
      <section className="bg-[#FFF9FB] rounded-3xl p-6 sm:p-10 border border-pink-200/70 shadow-xs space-y-8">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D81B60]">Parent Peace of Mind</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Our 4 Sacred Promises to Every Family
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-normal">
            Shop with total confidence, clarity, and delight
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#D81B60] flex items-center justify-center mx-auto shadow-2xs border border-pink-100">
              <Award className="w-6 h-6 stroke-[2]" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-gray-900">100% Quality Checked</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">Inspected for delicate seams and safe stitch finishing.</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#D81B60] flex items-center justify-center mx-auto shadow-2xs border border-pink-100">
              <Truck className="w-6 h-6 stroke-[2]" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-gray-900">3–5 Days Delivery</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">Express insured doorstep shipping across India.</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#D81B60] flex items-center justify-center mx-auto shadow-2xs border border-pink-100">
              <RotateCcw className="w-6 h-6 stroke-[2]" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-gray-900">7-Day Easy Exchange</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">Hassle-free size exchanges and supportive care.</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#D81B60] flex items-center justify-center mx-auto shadow-2xs border border-pink-100">
              <Lock className="w-6 h-6 stroke-[2]" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-gray-900">100% Safe Checkout</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">Secure encrypted payments via UPI, Cards, Netbanking & COD.</p>
          </div>
        </div>
      </section>

      {/* 10. Grand Celebration Invitation (Modern Clean CTA) */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#8B1D42] via-[#B81D52] to-[#D81B60] text-white p-8 sm:p-12 md:p-16 shadow-lg text-center space-y-8">
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-widest text-amber-200">
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span>Cherish Every Celebration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Dress Your Little One for the Next Family Celebration
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-pink-100 leading-relaxed font-normal max-w-xl mx-auto">
            Discover breathtaking festive silhouettes handcrafted with gentle cotton mulmul, radiant artisanal colors, and timeless Indian grace.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3.5 relative z-10">
          <Link
            to="/girls"
            className="bg-white text-[#8B1D42] hover:bg-pink-50 font-bold text-xs uppercase tracking-wider px-6 sm:px-8 py-3.5 rounded-xl shadow-sm transition-all hover:scale-102"
          >
            Shop Girls Collection
          </Link>
          <Link
            to="/boys"
            className="bg-gray-900 text-white hover:bg-black font-bold text-xs uppercase tracking-wider px-6 sm:px-8 py-3.5 rounded-xl shadow-sm transition-all hover:scale-102"
          >
            Shop Boys Collection
          </Link>
          <Link
            to="/siblings"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/40 font-bold text-xs uppercase tracking-wider px-6 sm:px-8 py-3.5 rounded-xl transition-all hover:scale-102"
          >
            Shop Sibling Sets
          </Link>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-wider px-6 sm:px-8 py-3.5 rounded-xl shadow-sm transition-all hover:scale-102 flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Styling Concierge</span>
          </a>
        </div>
      </section>

    </div>
  );
}
