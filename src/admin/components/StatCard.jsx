import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({
  title,
  value,
  growth,
  isPositive = true,
  comparisonText = 'vs previous period',
  icon: Icon,
  iconBg = 'bg-pink-50 text-[#D81B60]',
  subtitle
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-pink-100/80 shadow-2xs hover:shadow-xs transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</p>
          <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 leading-tight">
            {value}
          </h3>
        </div>

        {Icon && (
          <div className={`p-3 rounded-2xl shrink-0 ${iconBg}`}>
            <Icon className="w-5 h-5 stroke-[2]" />
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
        {growth && (
          <div className={`flex items-center gap-1 font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{growth}</span>
          </div>
        )}

        <span className="text-gray-400 text-[11px] font-normal">
          {subtitle || comparisonText}
        </span>
      </div>
    </div>
  );
}
