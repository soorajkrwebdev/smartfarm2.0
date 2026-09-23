import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: Option[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  options,
  children,
  className,
  id,
  required,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          required={required}
          className={twMerge(
            clsx(
              'block w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer',
              error
                ? 'border-rose-300 focus:border-rose-500 text-rose-900'
                : 'border-slate-200 hover:border-slate-300 focus:border-emerald-600',
              className
            )
          )}
          {...props}
        >
          {options
            ? options.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error ? (
        <p className="text-xs text-rose-600 mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
