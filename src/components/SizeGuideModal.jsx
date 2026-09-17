import React, { useState } from 'react';
import { X, Ruler, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function SizeGuideModal({ isOpen, onClose, category = 'Girls' }) {
  const [activeTab, setActiveTab] = useState('chart'); // 'chart' | 'measuring'

  if (!isOpen) return null;

  const sizeChartData = [
    { age: '0–6 Months', size: '0-6M', height: '60–68 cm', chest: '42–46 cm', waist: '42–45 cm', fit: 'Regular' },
    { age: '6–12 Months', size: '6-12M', height: '68–74 cm', chest: '46–48 cm', waist: '45–47 cm', fit: 'Regular' },
    { age: '1–2 Years', size: '1-2Y', height: '80–92 cm', chest: '50–53 cm', waist: '48–50 cm', fit: 'Comfort' },
    { age: '2–4 Years', size: '2-4Y', height: '92–104 cm', chest: '54–57 cm', waist: '51–53 cm', fit: 'Comfort' },
    { age: '4–6 Years', size: '4-6Y', height: '104–116 cm', chest: '58–61 cm', waist: '54–56 cm', fit: 'Comfort' },
    { age: '6–8 Years', size: '6-8Y', height: '116–128 cm', chest: '62–66 cm', waist: '57–59 cm', fit: 'Standard' },
    { age: '9–12 Years', size: '9-12Y', height: '128–152 cm', chest: '67–75 cm', waist: '60–65 cm', fit: 'Standard' },
    { age: '13–16 Years', size: '13-16Y', height: '152–168 cm', chest: '76–84 cm', waist: '66–72 cm', fit: 'Standard' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-pink-100 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-pink-50 text-[#D81B60] rounded-2xl border border-pink-100">
              <Ruler className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-xl text-gray-900 flex items-center gap-2">
                <span>Kids Ethnic Size Guide</span>
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-mono">{category}</span>
              </h2>
              <p className="text-xs text-gray-500 font-semibold">
                Find the perfect fit for your growing child with +2 inch margin flexibility
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 gap-4 text-xs font-extrabold">
          <button
            onClick={() => setActiveTab('chart')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'chart'
                ? 'border-[#D81B60] text-[#D81B60]'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            Size Measurements Chart
          </button>
          <button
            onClick={() => setActiveTab('measuring')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'measuring'
                ? 'border-[#D81B60] text-[#D81B60]'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            How To Measure Kids
          </button>
        </div>

        {/* Tab 1: Size Chart Table */}
        {activeTab === 'chart' && (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-pink-100 shadow-2xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-pink-50/70 text-[#8E1B46] font-extrabold border-b border-pink-100">
                    <th className="p-3">Age Group</th>
                    <th className="p-3">Standard Size</th>
                    <th className="p-3">Child Height</th>
                    <th className="p-3">Chest</th>
                    <th className="p-3">Waist</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {sizeChartData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-pink-50/20 transition-colors">
                      <td className="p-3 font-bold text-gray-900">{row.age}</td>
                      <td className="p-3 font-mono font-bold text-[#D81B60]">{row.size}</td>
                      <td className="p-3">{row.height}</td>
                      <td className="p-3">{row.chest}</td>
                      <td className="p-3">{row.waist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tohay Comfort Tips */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-extrabold">Tohay Heritage Margin Promise (+2 Inches Inside)</p>
                <p className="text-[11px] text-emerald-700 font-medium leading-relaxed">
                  All our lehengas, sherwanis, and kurtas come with 2-inch extra inner seam margins so you can easily alter as your child grows!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: How To Measure */}
        {activeTab === 'measuring' && (
          <div className="space-y-4 text-xs text-gray-600 font-medium leading-relaxed">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-2xl space-y-1">
                <p className="font-bold text-gray-900 text-xs">1. Chest Measurement</p>
                <p className="text-[11px] text-gray-500">Measure around the fullest part of the child's chest, keeping the tape snug but not tight.</p>
              </div>
              <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-2xl space-y-1">
                <p className="font-bold text-gray-900 text-xs">2. Waist Measurement</p>
                <p className="text-[11px] text-gray-500">Measure around the natural waistline where lehenga or pyjama elastic rests comfortably.</p>
              </div>
              <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-2xl space-y-1">
                <p className="font-bold text-gray-900 text-xs">3. Length / Height</p>
                <p className="text-[11px] text-gray-500">For gowns and lehengas, measure from shoulder to floor while child stands straight with shoes on.</p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-800">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold">In Between Sizes?</p>
                <p className="text-[11px] text-amber-700 font-medium">
                  If your child's measurement falls between two sizes, we recommend choosing 1 size larger for a comfortable fit and longer wearability.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-gray-800 transition-colors"
          >
            Got It, Close
          </button>
        </div>

      </div>
    </div>
  );
}
