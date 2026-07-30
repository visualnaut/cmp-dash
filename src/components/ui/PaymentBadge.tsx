import React from 'react';
import { PaymentStatus } from '../../types/order';

interface PaymentBadgeProps {
  status: PaymentStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const PaymentBadge: React.FC<PaymentBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-[11px] px-1.5 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
  }[size];

  switch (status) {
    case 'Paid':
      return (
        <span
          aria-label={`Payment status: ${status}`}
          className={`inline-flex items-center gap-1 rounded-full font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 ${sizeClasses}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
          Paid
        </span>
      );
    case 'Pending':
      return (
        <span
          aria-label={`Payment status: ${status}`}
          className={`inline-flex items-center gap-1 rounded-full font-medium bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 ${sizeClasses}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />
          Pending
        </span>
      );
    case 'Failed':
      return (
        <span
          aria-label={`Payment status: ${status}`}
          className={`inline-flex items-center gap-1 rounded-full font-medium bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20 ${sizeClasses}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" aria-hidden="true" />
          Failed
        </span>
      );
    default:
      return <span className="text-xs text-slate-500" aria-label={`Payment status: ${status}`}>{status}</span>;
  }
};
