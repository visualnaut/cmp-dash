import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-primary/10',
  iconColor = 'text-primary',
  trend,
}) => {
  return (
    <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow border border-base-200 p-5 rounded-2xl">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">{title}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-base-content/70 font-medium">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${iconBgColor} shrink-0`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-base-100 flex items-center gap-1.5 text-xs">
          <span
            className={`font-semibold ${
              trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {trend.value}
          </span>
          <span className="text-base-content/60">vs past average</span>
        </div>
      )}
    </div>
  );
};
