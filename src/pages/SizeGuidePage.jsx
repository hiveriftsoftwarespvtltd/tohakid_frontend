import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ruler, ChevronRight, CheckCircle2, Info, ShieldAlert,
  MoveHorizontal, MessageSquare, ArrowRight, Heart
} from 'lucide-react';
import { GIRLS_KURTI_AFGANI_DATA, BOYS_KURTA_PAJAMA_DATA } from '../utils/sizeConstants';

export default function SizeGuidePage() {
  const [selectedChart, setSelectedChart] = useState('girls-kurti'); // 'girls-kurti' | 'boys-kurta'
  const [unit, setUnit] = useState('in'); // 'in' | 'cm'
  const [selectedSizeRow, setSelectedSizeRow] = useState(null);

  // 1. Alia Kurti with Afgani Size Chart Data (in inches)
  const girlsKurtiAfganiData = GIRLS_KURTI_AFGANI_DATA;

  // 2. Boys Kurta & Pajama Size Chart Data (in inches)
  const boysKurtaPajamaData = BOYS_KURTA_PAJAMA_DATA;

  const formatVal = (val) => {
    if (unit === 'cm') {
      return (val * 2.54).toFixed(1);
    }
    return val;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/40 via-white to-pink-50/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link to="/" className="hover:text-[#D81B60] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[#D81B60] font-bold">Size Guide & Measurements</span>
        </nav>

        {/* Hero Header Banner */}
        <div className="text-center space-y-3 bg-gradient-to-r from-[#8E1B46] via-[#D81B60] to-pink-600 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-pink-100">
            <Ruler className="w-4 h-4 text-amber-300" />
            <span>Official Garment Specifications</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight">
            Tohay Kids Size Guide
          </h1>
          <p className="text-xs sm:text-base text-pink-100 max-w-2xl mx-auto font-medium">
            Find the perfect royal fit for your little ones.
          </p>
        </div>

        {/* Outfit Switcher & Unit Controls */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-xl space-y-6">

          {/* Outfit Switcher & Unit Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-5">
            {/* Category Pills */}
            <div className="flex p-1 bg-gray-100 rounded-2xl border border-gray-200/80 gap-1 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setSelectedChart('girls-kurti');
                  setSelectedSizeRow(null);
                }}
                className={`flex-1 sm:flex-initial py-2.5 px-5 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-center ${selectedChart === 'girls-kurti'
                  ? 'bg-white text-[#D81B60] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Alia Kurti with Afgani (Girls)
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedChart('boys-kurta');
                  setSelectedSizeRow(null);
                }}
                className={`flex-1 sm:flex-initial py-2.5 px-5 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-center ${selectedChart === 'boys-kurta'
                  ? 'bg-white text-[#0284C7] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Kurta & Pajama (Boys)
              </button>
            </div>

            {/* Unit Switcher */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-xs font-bold text-gray-500">Unit:</span>
              <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setUnit('in')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${unit === 'in'
                    ? selectedChart === 'boys-kurta'
                      ? 'bg-white text-[#0284C7] shadow-xs font-extrabold'
                      : 'bg-white text-[#D81B60] shadow-xs font-extrabold'
                    : 'text-gray-500 hover:text-gray-800'
                    }`}
                >
                  Inches (in)
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('cm')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${unit === 'cm'
                    ? selectedChart === 'boys-kurta'
                      ? 'bg-white text-[#0284C7] shadow-xs font-extrabold'
                      : 'bg-white text-[#D81B60] shadow-xs font-extrabold'
                    : 'text-gray-500 hover:text-gray-800'
                    }`}
                >
                  Centimeters (cm)
                </button>
              </div>
            </div>
          </div>

          {/* Swipe Hint */}
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-100">
            <span className="flex items-center gap-1.5 text-[#D81B60]">
              <MoveHorizontal className="w-4 h-4 animate-pulse" />
              <span>Click any row to highlight specifications. Scroll horizontally on mobile.</span>
            </span>
            <span className="text-gray-400">Dimensions in {unit === 'in' ? 'inches' : 'cm'}</span>
          </div>

          {/* Table Container */}
          <div className="rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto no-scrollbar">
              {selectedChart === 'boys-kurta' ? (
                /* Boys Kurta & Pajama Table */
                <table className="w-full text-center border-collapse text-xs sm:text-sm min-w-[550px]">
                  <thead>
                    <tr className="border-b border-sky-200 bg-sky-50 text-[#0369A1] font-extrabold">
                      <th className="p-3 bg-sky-100/95 text-[#0369A1] font-black uppercase border-r border-sky-200 sticky left-0 z-20 min-w-[80px]">
                        NUMERIC SIZE (INCHES)
                      </th>
                      <th className="p-3 border-r border-sky-100 min-w-[120px] bg-sky-50/90 text-[#0369A1] font-extrabold">APPROXIMATE AGE</th>
                      <th className="p-3 border-r border-sky-100">CHEST</th>
                      <th className="p-3 border-r border-sky-100">KURTA LENGTH</th>
                      <th className="p-3 border-r border-sky-100">SLEEVE</th>
                      <th className="p-3 bg-indigo-50/95 text-indigo-900">PAJAMA LENGTH</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {boysKurtaPajamaData.map((row, idx) => {
                      const isSelected = selectedSizeRow === row.size;
                      return (
                        <tr
                          key={row.size}
                          onClick={() => setSelectedSizeRow(isSelected ? null : row.size)}
                          className={`transition-colors cursor-pointer ${isSelected
                            ? 'bg-sky-100/80 font-bold text-sky-950'
                            : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                            } hover:bg-sky-50/70`}
                        >
                          <td className="p-3 font-mono font-black text-xs sm:text-sm text-[#0284C7] bg-inherit border-r border-sky-100 sticky left-0 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
                            Size {row.size}
                          </td>
                          <td className="p-3 border-r border-gray-100 text-xs sm:text-sm font-bold text-sky-900 whitespace-nowrap bg-sky-50/30">
                            {row.age}
                          </td>
                          <td className="p-3 border-r border-gray-100 font-semibold text-gray-800">
                            {formatVal(row.chest)}
                          </td>
                          <td className="p-3 border-r border-gray-100 font-semibold text-gray-800">
                            {formatVal(row.length)}
                          </td>
                          <td className="p-3 border-r border-sky-100 font-semibold text-gray-800">
                            {formatVal(row.sleeve)}
                          </td>
                          <td className="p-3 font-semibold text-indigo-900 bg-indigo-50/20">
                            {formatVal(row.pajama)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                /* Girls Alia Kurti with Afgani Table */
                <table className="w-full text-center border-collapse text-xs sm:text-sm min-w-[650px]">
                  <thead>
                    <tr className="border-b border-pink-200 bg-pink-50 text-[#8E1B46] font-extrabold">
                      <th className="p-3 bg-pink-100/95 text-[#8E1B46] font-black uppercase border-r border-pink-200 sticky left-0 z-20 min-w-[80px]">
                        NUMERIC SIZE (INCHES)
                      </th>
                      <th className="p-3 border-r border-pink-100 min-w-[120px] bg-pink-50/90 text-[#8E1B46] font-extrabold">APPROXIMATE AGE</th>
                      <th className="p-3 border-r border-pink-100">CHEST</th>
                      <th className="p-3 border-r border-pink-100">KURTI LENGTH</th>
                      <th className="p-3 border-r border-pink-200">SLEEVE</th>
                      <th className="p-3 border-r border-amber-100 bg-amber-50/80 text-amber-950">AFGANI LENGTH</th>
                      <th className="p-3 border-r border-amber-100 bg-amber-50/80 text-amber-950">WAIST*</th>
                      <th className="p-3 bg-amber-50/80 text-amber-950">HIP</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {girlsKurtiAfganiData.map((row, idx) => {
                      const isSelected = selectedSizeRow === row.size;
                      return (
                        <tr
                          key={row.size}
                          onClick={() => setSelectedSizeRow(isSelected ? null : row.size)}
                          className={`transition-colors cursor-pointer ${isSelected
                            ? 'bg-pink-100/80 font-bold text-pink-950'
                            : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                            } hover:bg-pink-50/70`}
                        >
                          <td className="p-3 font-mono font-black text-xs sm:text-sm text-[#D81B60] bg-inherit border-r border-pink-100 sticky left-0 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
                            Size {row.size}
                          </td>
                          <td className="p-3 border-r border-gray-100 text-xs sm:text-sm font-bold text-pink-900 whitespace-nowrap bg-pink-50/30">
                            {row.age}
                          </td>
                          <td className="p-3 border-r border-gray-100 font-semibold text-gray-800">
                            {formatVal(row.chest)}
                          </td>
                          <td className="p-3 border-r border-gray-100 font-semibold text-gray-800">
                            {formatVal(row.length)}
                          </td>
                          <td className="p-3 border-r border-pink-100 font-semibold text-gray-800">
                            {formatVal(row.sleeve)}
                          </td>
                          <td className="p-3 border-r border-gray-100 font-semibold text-gray-800 bg-amber-50/15">
                            {formatVal(row.pants)}
                          </td>
                          <td className="p-3 border-r border-gray-100 font-semibold text-gray-800 bg-amber-50/15">
                            {formatVal(row.waist)}
                          </td>
                          <td className="p-3 font-semibold text-gray-800 bg-amber-50/15">
                            {formatVal(row.hip)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Important Footnotes */}

        </div>

        {/* How to Measure Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-xl space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="font-heading font-extrabold text-lg sm:text-xl text-gray-900 flex items-center gap-2">
              <Ruler className="w-5 h-5 text-[#D81B60]" />
              <span>How to Measure Your Child</span>
            </h2>
            <p className="text-xs text-gray-500 font-normal">
              Follow these simple tips to get accurate measurements using a soft measuring tape.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-pink-50/50 border border-pink-100 rounded-2xl space-y-1">
              <p className="font-bold text-gray-900 text-xs text-[#D81B60]">1. Chest (Kurta / Kurti)</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Measure around the fullest part of chest, under the arms, tape comfortably snug.
              </p>
            </div>

            <div className="p-4 bg-pink-50/50 border border-pink-100 rounded-2xl space-y-1">
              <p className="font-bold text-gray-900 text-xs text-[#D81B60]">2. Kurta / Kurti Length</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Measure straight from the highest shoulder point down to the bottom hemline.
              </p>
            </div>

            <div className="p-4 bg-pink-50/50 border border-pink-100 rounded-2xl space-y-1">
              <p className="font-bold text-gray-900 text-xs text-[#D81B60]">3. Sleeve Length</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Measure from the edge of shoulder seam down to the sleeve cuff end.
              </p>
            </div>

            <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-2xl space-y-1">
              <p className="font-bold text-gray-900 text-xs text-purple-800">4. Bottom (Pajama / Afgani)</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Measure from the waistline down along the outside leg to the ankle bone.
              </p>
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-800">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-xs">Between Sizes?</p>
              <p className="text-xs leading-relaxed">
                If your child is between sizes or has a growth spurt, we recommend choosing <strong>1 size larger</strong> for comfortable movement during festivals and extended longevity.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Shopping / Support CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/girls"
            className="p-5 bg-gradient-to-br from-pink-50 to-pink-100/60 rounded-2xl border border-pink-200/80 hover:shadow-md transition-all group flex items-center justify-between"
          >
            <div>
              <h3 className="font-extrabold text-sm text-gray-900 group-hover:text-[#D81B60] transition-colors">
                Shop Girls Collection
              </h3>
              <p className="text-xs text-gray-500">Lehengas, Shararas & Gowns</p>
            </div>
            <ArrowRight className="w-5 h-5 text-[#D81B60] group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/boys"
            className="p-5 bg-gradient-to-br from-sky-50 to-sky-100/60 rounded-2xl border border-sky-200/80 hover:shadow-md transition-all group flex items-center justify-between"
          >
            <div>
              <h3 className="font-extrabold text-sm text-gray-900 group-hover:text-[#0284C7] transition-colors">
                Shop Boys Collection
              </h3>
              <p className="text-xs text-gray-500">Kurta Pajama & Dhoti Sets</p>
            </div>
            <ArrowRight className="w-5 h-5 text-[#0284C7] group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href="https://wa.me/919261874142"
            target="_blank"
            rel="noreferrer"
            className="p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/60 rounded-2xl border border-emerald-200/80 hover:shadow-md transition-all group flex items-center justify-between"
          >
            <div>
              <h3 className="font-extrabold text-sm text-gray-900 group-hover:text-emerald-700 transition-colors">
                Need Sizing Help?
              </h3>
              <p className="text-xs text-gray-500">Chat with our stylist on WhatsApp</p>
            </div>
            <MessageSquare className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
          </a>
        </div>

      </div>
    </div>
  );
}
