import React from 'react';
import { Tag } from 'lucide-react';
import { useTopSellingServices } from '../../../hooks/useDashboard';
import { ErrorState } from '../../../components/feedback/ErrorState';

export const TopSellingServicesList: React.FC = () => {
  const { data: services = [], isLoading, isError, error, refetch } = useTopSellingServices();

  if (isLoading) {
    return (
      <div className="card bg-base-100 shadow-sm border border-base-200 p-6 rounded-2xl animate-pulse space-y-4">
        <div className="flex justify-between items-center mb-2">
          <div className="h-5 bg-base-200 rounded w-1/3"></div>
          <div className="h-8 w-8 bg-base-200 rounded-lg"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-base-200 rounded w-full"></div>
              <div className="h-2 bg-base-200 rounded-full w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card bg-base-100 shadow-sm border border-base-200 p-6 rounded-2xl">
        <ErrorState
          title="Top Selling Services Unavailable"
          message={error instanceof Error ? error.message : 'Unable to load service breakdown.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const maxCount = Math.max(...services.map((s) => s.count), 1);

  return (
    <div className="card bg-base-100 shadow-sm border border-base-200 p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-base-content">Top Selling Services</h3>
          <p className="text-xs text-base-content/60">Ranked by volume of guest requests</p>
        </div>
        <div className="p-2 bg-primary/10 text-primary rounded-lg">
          <Tag className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-4">
        {services.map((item, index) => {
          const percentage = Math.round((item.count / maxCount) * 100);

          return (
            <div key={item.service} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-base-200 text-base-content/70 flex items-center justify-center text-[10px] font-bold">
                    #{index + 1}
                  </span>
                  <span className="text-base-content font-bold">{item.service}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-base-content/60">{item.count} orders</span>
                  <span className="text-emerald-700 font-extrabold">${item.totalRevenue}</span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-base-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
