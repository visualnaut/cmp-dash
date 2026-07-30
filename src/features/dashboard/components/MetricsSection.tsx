import React from 'react';
import { useOrderMetrics } from '../../../hooks/useDashboard';
import { MetricCard } from '../../../components/ui/MetricCard';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { Users, Clock, DollarSign, CheckCircle2, TrendingUp } from 'lucide-react';

export const MetricsSection: React.FC = () => {
  const { data: metrics, isLoading, isError, error, refetch } = useOrderMetrics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card bg-base-100 p-6 rounded-2xl shadow-xs border border-base-200 animate-pulse h-32 flex justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-base-200 rounded w-24"></div>
              <div className="h-8 bg-base-300 rounded w-16"></div>
              <div className="h-3 bg-base-200 rounded w-32"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError || !metrics) {
    return (
      <ErrorState
        title="Failed to load metrics"
        message={error instanceof Error ? error.message : 'Unable to calculate dashboard metrics.'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <MetricCard
        title="Active Guests"
        value={metrics.activeGuests}
        subtitle="Guests with active service requests"
        icon={Users}
        iconBgColor="bg-blue-500/10"
        iconColor="text-blue-600"
      />

      <MetricCard
        title="Pending Orders"
        value={metrics.pendingOrders}
        subtitle="New or Acknowledged status"
        icon={Clock}
        iconBgColor="bg-amber-500/10"
        iconColor="text-amber-600"
      />

      <MetricCard
        title="Revenue Today"
        value={`$${metrics.revenueToday.toLocaleString()}`}
        subtitle="Total amount for today"
        icon={DollarSign}
        iconBgColor="bg-emerald-500/10"
        iconColor="text-emerald-600"
      />

      <MetricCard
        title="Completed Today"
        value={metrics.completedToday}
        subtitle="Fulfilled guest requests"
        icon={CheckCircle2}
        iconBgColor="bg-teal-500/10"
        iconColor="text-teal-600"
      />

      <MetricCard
        title="Average Order Value"
        value={`$${metrics.averageOrderValue}`}
        subtitle="Excludes complimentary services"
        icon={TrendingUp}
        iconBgColor="bg-purple-500/10"
        iconColor="text-purple-600"
      />

      <MetricCard
        title="Total Orders Tracked"
        value={metrics.totalOrders}
        subtitle="Across all lifecycle stages"
        icon={Clock}
        iconBgColor="bg-indigo-500/10"
        iconColor="text-indigo-600"
      />
    </div>
  );
};
