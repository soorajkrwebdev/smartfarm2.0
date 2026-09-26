import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  accentColor?: 'emerald' | 'amber' | 'blue' | 'indigo' | 'rose';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon,
  trend,
  accentColor = 'emerald',
}) => {
  const iconColorStyles = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h4 className="text-2xl font-bold text-slate-900 mt-1.5 tracking-tight">{value}</h4>
          {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-xl border ${iconColorStyles[accentColor]} shrink-0`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-3.5 pt-3 border-t border-slate-50 flex items-center gap-1.5 text-xs">
          <span className={`font-semibold ${trend.isPositive ? 'text-emerald-600' : 'text-slate-500'}`}>
            {trend.value}
          </span>
          <span className="text-slate-400">vs last month</span>
        </div>
      )}
    </div>
  );
};
