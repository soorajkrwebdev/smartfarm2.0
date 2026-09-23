import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'blue' | 'slate' | 'rose' | 'indigo' | 'purple';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'emerald',
  size = 'md',
  icon,
  className,
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium gap-1',
    md: 'text-xs px-2.5 py-1 font-semibold gap-1.5',
  };

  const variantClasses = {
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    amber: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    blue: 'bg-blue-50 text-blue-700 border border-blue-200/60',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200',
    rose: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200/60',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center rounded-full leading-none whitespace-nowrap',
          sizeClasses[size],
          variantClasses[variant],
          className
        )
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
