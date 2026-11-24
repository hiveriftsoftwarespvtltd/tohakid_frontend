import React, { useState, useEffect } from 'react';
import { X, Ruler, CheckCircle2, ShieldAlert, Info, MoveHorizontal, ChevronRight } from 'lucide-react';
import { GIRLS_KURTI_AFGANI_DATA, BOYS_KURTA_PAJAMA_DATA } from '../utils/sizeConstants';

export default function SizeGuideModal({ isOpen, onClose, category = '', product = null }) {
  const [activeTab, setActiveTab] = useState('chart'); // 'chart' | 'measuring'
  const [unit, setUnit] = useState('in'); // 'in' | 'cm'
  const [selectedSizeRow, setSelectedSizeRow] = useState(null);

  // Determine initial chart based on product / category
  const isBoysCategory = () => {
    const textToCheck = `${category} ${product?.category || ''} ${product?.subcategory || ''} ${product?.name || ''}`.toLowerCase();
    return textToCheck.includes('boy') || textToCheck.includes('pajama') || textToCheck.includes('dhoti') || textToCheck.includes('kurta');
  };

  const [selectedChart, setSelectedChart] = useState('girls-kurti'); // 'girls-kurti' | 'boys-kurta'

  useEffect(() => {
    if (isOpen) {
      setSelectedChart(isBoysCategory() ? 'boys-kurta' : 'girls-kurti');
      setSelectedSizeRow(null);
    }
  }, [isOpen, category, product]);

  if (!isOpen) return null;

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

  const currentDataset = selectedChart === 'boys-kurta' ? boysKurtaPajamaData : girlsKurtiAfganiData;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      
      {/* Click outside to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-3xl w-full p-4 sm:p-6 space-y-3.5 sm:space-y-4 shadow-2xl border border-pink-100 relative max-h-[92vh] sm:max-h-[88vh] flex flex-col animate-in slide-in-from-bottom-4 duration-250">
        
        {/* Mobile Pull Indicator */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto sm:hidden -mt-1 mb-1" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 gap-2 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border shrink-0 ${
              selectedChart === 'boys-kurta' 
                ? 'bg-sky-50 text-[#0284C7] border-sky-100'
                : 'bg-pink-50 text-[#D81B60] border-pink-100'
            }`}>
              <Ruler className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-base sm:text-lg text-gray-900 leading-tight">
                Size Measurements Guide
              </h2>
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                Garment measurements in {unit === 'in' ? 'Inches (in)' : 'Centimeters (cm)'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Segmented Outfit Switcher: Girls vs Boys */}
        <div className="flex p-1 bg-gray-100 rounded-xl border border-gray-200/80 gap-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              setSelectedChart('girls-kurti');
              setSelectedSizeRow(null);
            }}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer text-center truncate ${
              selectedChart === 'girls-kurti'
                ? 'bg-white text-[#D81B60] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="sm:hidden">Girls (Kurti & Afgani)</span>
            <span className="hidden sm:inline">Alia Kurti with Afgani (Girls)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedChart('boys-kurta');
              setSelectedSizeRow(null);
            }}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer text-center truncate ${
              selectedChart === 'boys-kurta'
                ? 'bg-white text-[#0284C7] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="sm:hidden">Boys (Kurta & Pajama)</span>
            <span className="hidden sm:inline">Kurta & Pajama (Boys)</span>
          </button>
        </div>

        {/* Navigation Tabs & Unit Toggle Row */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 gap-2 text-xs font-extrabold shrink-0">
          <div className="flex gap-3 sm:gap-4">
            <button
              onClick={() => setActiveTab('chart')}
              className={`pb-1.5 border-b-2 text-xs transition-colors cursor-pointer ${
                activeTab === 'chart'
                  ? selectedChart === 'boys-kurta' ? 'border-[#0284C7] text-[#0284C7]' : 'border-[#D81B60] text-[#D81B60]'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              Measurements Chart
            </button>
            <button
              onClick={() => setActiveTab('measuring')}
              className={`pb-1.5 border-b-2 text-xs transition-colors cursor-pointer ${
                activeTab === 'measuring'
                  ? selectedChart === 'boys-kurta' ? 'border-[#0284C7] text-[#0284C7]' : 'border-[#D81B60] text-[#D81B60]'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              How to Measure
            </button>
          </div>

          {/* Unit Switcher */}
          {activeTab === 'chart' && (
            <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-[10px] sm:text-[11px] font-bold shrink-0">
              <button
                type="button"
                onClick={() => setUnit('in')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  unit === 'in'
                    ? selectedChart === 'boys-kurta' ? 'bg-white text-[#0284C7] shadow-2xs font-extrabold' : 'bg-white text-[#D81B60] shadow-2xs font-extrabold'
                    : 'text-gray-500'
                }`}
              >
                Inches
              </button>
              <button
                type="button"
                onClick={() => setUnit('cm')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  unit === 'cm'
                    ? selectedChart === 'boys-kurta' ? 'bg-white text-[#0284C7] shadow-2xs font-extrabold' : 'bg-white text-[#D81B60] shadow-2xs font-extrabold'
                    : 'text-gray-500'
                }`}
              >
                CM
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-0.5 overscroll-contain">
          
          {/* TAB 1: MEASUREMENTS CHART */}
          {activeTab === 'chart' && (
            <div className="space-y-3">
              
              {/* Mobile Swipe Hint */}
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-gray-500 font-semibold bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                <span className="flex items-center gap-1 text-[#D81B60]">
                  <MoveHorizontal className="w-3.5 h-3.5 animate-pulse" />
                  <span>Scroll right to view all specs</span>
                </span>
                <span className="text-gray-400">Unit: {unit === 'in' ? 'inches' : 'cm'}</span>
              </div>

              {/* Responsive Table with Pinned Sticky Size Column */}
              <div className="relative rounded-xl border border-gray-200/90 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto max-h-[50vh] sm:max-h-[52vh] no-scrollbar">
                  
                  {selectedChart === 'boys-kurta' ? (
                    /* Boys Kurta & Pajama Table */
                    <table className="w-full text-center border-collapse text-[11px] sm:text-xs min-w-[480px]">
                      <thead className="sticky top-0 z-30 shadow-2xs">
                        <tr className="border-b border-sky-200 bg-sky-50 text-[#0369A1] font-extrabold">
                          <th className="p-2 sm:p-2.5 bg-sky-100/95 text-[#0369A1] font-black uppercase border-r border-sky-200 sticky left-0 z-40 min-w-[70px] shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                            SIZE
                          </th>
                          <th className="p-2 sm:p-2.5 border-r border-sky-100 min-w-[100px] text-[#0369A1] font-extrabold bg-sky-50/90">
                            APPROX. AGE
                          </th>
                          <th className="p-2 sm:p-2.5 border-r border-sky-100 min-w-[65px]">CHEST</th>
                          <th className="p-2 sm:p-2.5 border-r border-sky-100 min-w-[75px]">KURTA LEN</th>
                          <th className="p-2 sm:p-2.5 border-r border-sky-100 min-w-[70px]">SLEEVE</th>
                          <th className="p-2 sm:p-2.5 bg-indigo-50/95 text-indigo-900 min-w-[65px]">PAJAMA</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                        {boysKurtaPajamaData.map((row, idx) => {
                          const isSelected = selectedSizeRow === row.size;
                          return (
                            <tr
                              key={row.size}
                              onClick={() => setSelectedSizeRow(isSelected ? null : row.size)}
                              className={`transition-colors cursor-pointer ${
                                isSelected 
                                  ? 'bg-sky-50 font-bold' 
                                  : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                              } hover:bg-sky-50/50`}
                            >
                              <td className="p-2 sm:p-2.5 font-mono font-black text-xs text-[#0284C7] bg-inherit border-r border-sky-100 sticky left-0 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                                Size {row.size}
                              </td>
                              <td className="p-2 sm:p-2.5 border-r border-sky-100 font-bold text-sky-900 text-[11px] whitespace-nowrap bg-sky-50/40">
                                {row.age}
                              </td>
                              <td className="p-2 sm:p-2.5 border-r border-gray-100 font-semibold text-gray-800">
                                {formatVal(row.chest)}
                              </td>
                              <td className="p-2 sm:p-2.5 border-r border-gray-100 font-semibold text-gray-800">
                                {formatVal(row.length)}
                              </td>
                              <td className="p-2 sm:p-2.5 border-r border-sky-100 font-semibold text-gray-800">
                                {formatVal(row.sleeve)}
                              </td>
                              <td className="p-2 sm:p-2.5 font-semibold text-indigo-900 bg-indigo-50/20">
                                {formatVal(row.pajama)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    /* Girls Alia Kurti with Afgani Table */
                    <table className="w-full text-center border-collapse text-[11px] sm:text-xs min-w-[560px]">
                      <thead className="sticky top-0 z-30 shadow-2xs">
                        <tr className="border-b border-pink-200 bg-pink-50 text-[#8E1B46] font-extrabold">
                          <th className="p-2 sm:p-2.5 bg-pink-100/95 text-[#8E1B46] font-black uppercase border-r border-pink-200 sticky left-0 z-40 min-w-[70px] shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                            SIZE
                          </th>
                          <th className="p-2 sm:p-2.5 border-r border-pink-100 min-w-[100px] text-[#8E1B46] font-extrabold bg-pink-50/90">
                            APPROX. AGE
                          </th>
                          <th className="p-2 sm:p-2.5 border-r border-pink-100 min-w-[65px]">CHEST</th>
                          <th className="p-2 sm:p-2.5 border-r border-pink-100 min-w-[70px]">LENGTH</th>
                          <th className="p-2 sm:p-2.5 border-r border-pink-200 min-w-[65px]">SLEEVE</th>
                          <th className="p-2 sm:p-2.5 border-r border-amber-100 bg-amber-50/80 text-amber-950 min-w-[75px]">AFGANI</th>
                          <th className="p-2 sm:p-2.5 border-r border-amber-100 bg-amber-50/80 text-amber-950 min-w-[65px]">WAIST*</th>
                          <th className="p-2 sm:p-2.5 bg-amber-50/80 text-amber-950 min-w-[65px]">HIP</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                        {girlsKurtiAfganiData.map((row, idx) => {
                          const isSelected = selectedSizeRow === row.size;
                          return (
                            <tr
                              key={row.size}
                              onClick={() => setSelectedSizeRow(isSelected ? null : row.size)}
                              className={`transition-colors cursor-pointer ${
                                isSelected 
                                  ? 'bg-pink-50 font-bold' 
                                  : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                              } hover:bg-pink-50/50`}
                            >
                              <td className="p-2 sm:p-2.5 font-mono font-black text-xs text-[#D81B60] bg-inherit border-r border-pink-100 sticky left-0 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                                Size {row.size}
                              </td>
                              <td className="p-2 sm:p-2.5 border-r border-pink-100 font-bold text-pink-900 text-[11px] whitespace-nowrap bg-pink-50/40">
                                {row.age}
                              </td>
                              <td className="p-2 sm:p-2.5 border-r border-gray-100 font-semibold text-gray-800">
                                {formatVal(row.chest)}
                              </td>
                              <td className="p-2 sm:p-2.5 border-r border-gray-100 font-semibold text-gray-800">
                                {formatVal(row.length)}
                              </td>
                              <td className="p-2 sm:p-2.5 border-r border-pink-100 font-semibold text-gray-800">
                                {formatVal(row.sleeve)}
                              </td>
                              <td className="p-2 sm:p-2.5 border-r border-gray-100 font-semibold text-gray-800 bg-amber-50/15">
                                {formatVal(row.pants)}
                              </td>
                              <td className="p-2 sm:p-2.5 border-r border-gray-100 font-semibold text-gray-800 bg-amber-50/15">
                                {formatVal(row.waist)}
                              </td>
                              <td className="p-2 sm:p-2.5 font-semibold text-gray-800 bg-amber-50/15">
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

              {/* Informative Notes in Compact Clean Cards */}
              {selectedChart === 'girls-kurti' && (
                <div className="p-2.5 bg-amber-50/80 border border-amber-200/90 rounded-xl flex items-start gap-2 text-amber-900 text-xs">
                  <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] sm:text-[11px] leading-relaxed">
                    <strong>* Waist Measurement:</strong> Un-stretched elastic waist. Expands equal to hip size when worn.
                  </p>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: HOW TO MEASURE */}
          {activeTab === 'measuring' && (
            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-3 bg-sky-50/50 border border-sky-100 rounded-xl space-y-0.5">
                  <p className="font-bold text-gray-900 text-xs text-[#0284C7]">1. Chest (Kurta / Kurti)</p>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Measure around the fullest part of chest, under the arms, tape comfortably snug.
                  </p>
                </div>

                <div className="p-3 bg-sky-50/50 border border-sky-100 rounded-xl space-y-0.5">
                  <p className="font-bold text-gray-900 text-xs text-[#0284C7]">2. Kurta / Kurti Length</p>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Measure straight from the highest shoulder point down to the bottom hemline.
                  </p>
                </div>

                <div className="p-3 bg-sky-50/50 border border-sky-100 rounded-xl space-y-0.5">
                  <p className="font-bold text-gray-900 text-xs text-[#0284C7]">3. Sleeve Length</p>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Measure from the edge of shoulder seam down to the sleeve cuff end.
                  </p>
                </div>

                <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-0.5">
                  <p className="font-bold text-gray-900 text-xs text-indigo-800">4. Bottom Length (Pajama / Afgani)</p>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Measure from the waistline down along outside leg to the ankle bone.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-800">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>In Between Sizes?</strong> We recommend picking <strong>1 size larger</strong> for comfortable festive wear and extra longevity.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2 shrink-0">
          <span className="text-[10px] sm:text-[11px] text-gray-400">
            * Standard Indian ethnic dimensions
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
}
