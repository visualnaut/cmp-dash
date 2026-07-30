import React from 'react';
import { OrderStatus } from '../../types/order';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'badge-xs text-[10px] px-1.5 py-0.5',
    md: 'badge-sm text-xs font-semibold px-2.5 py-1',
    lg: 'badge-md text-sm font-semibold px-3 py-1.5',
  }[size];

  switch (status) {
    case 'New':
      return (
        <span
          aria-label={`Order status: ${status}`}
          className={`badge badge-info bg-sky-100 text-sky-800 border-sky-300 font-medium ${sizeClasses}`}
        >
          New
        </span>
      );
    case 'Acknowledged':
      return (
        <span
          aria-label={`Order status: ${status}`}
          className={`badge badge-secondary bg-indigo-100 text-indigo-800 border-indigo-300 font-medium ${sizeClasses}`}
        >
          Acknowledged
        </span>
      );
    case 'In Progress':
      return (
        <span
          aria-label={`Order status: ${status}`}
          className={`badge badge-warning bg-amber-100 text-amber-900 border-amber-300 font-medium ${sizeClasses}`}
        >
          In Progress
        </span>
      );
    case 'Completed':
      return (
        <span
          aria-label={`Order status: ${status}`}
          className={`badge badge-success bg-emerald-100 text-emerald-800 border-emerald-300 font-medium ${sizeClasses}`}
        >
          Completed
        </span>
      );
    case 'Cancelled':
      return (
        <span
          aria-label={`Order status: ${status}`}
          className={`badge badge-ghost bg-slate-200 text-slate-700 border-slate-300 font-medium ${sizeClasses}`}
        >
          Cancelled
        </span>
      );
    default:
      return (
        <span aria-label={`Order status: ${status}`} className={`badge badge-neutral ${sizeClasses}`}>
          {status}
        </span>
      );
  }
};
