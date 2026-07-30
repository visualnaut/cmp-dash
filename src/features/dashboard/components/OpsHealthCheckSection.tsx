import React from 'react';
import { Link } from 'react-router';
import { useOpsHealthCheck } from '../../../hooks/useDashboard';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { ArrowRight, ChevronRight } from 'lucide-react';

export const OpsHealthCheckSection: React.FC = () => {
  const { data: health, isLoading, isError, error, refetch } = useOpsHealthCheck();

  if (isLoading) {
    return (
      <div className="card bg-base-100 shadow-sm border border-base-200 p-6 rounded-2xl animate-pulse space-y-4">
        <div className="h-5 bg-base-200 rounded w-1/3"></div>
        <div className="h-3 bg-base-200 rounded w-1/2"></div>
        <div className="space-y-3 pt-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-base-200/60 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !health) {
    return (
      <div className="card bg-base-100 shadow-sm border border-base-200 p-6 rounded-2xl">
        <ErrorState
          title="Health Check Unavailable"
          message={error instanceof Error ? error.message : 'Failed to check workload metrics.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-sm border border-base-200 p-6 rounded-2xl flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-base-content mb-1">Operational Health Check</h3>
        <p className="text-xs text-base-content/60 mb-5">Quick breakdown of current workload (click to filter)</p>

        <div className="space-y-3">
          <Link
            to="/orders?status=New"
            className="flex justify-between items-center text-sm p-3 bg-base-200/50 hover:bg-base-200 rounded-xl transition-colors group cursor-pointer"
          >
            <span className="font-semibold text-base-content/80 group-hover:text-primary flex items-center gap-1.5">
              New Requests
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
            </span>
            <span className="badge badge-info font-bold">
              {health.newOrders}
            </span>
          </Link>

          <Link
            to="/orders?status=Acknowledged"
            className="flex justify-between items-center text-sm p-3 bg-base-200/50 hover:bg-base-200 rounded-xl transition-colors group cursor-pointer"
          >
            <span className="font-semibold text-base-content/80 group-hover:text-primary flex items-center gap-1.5">
              Acknowledged
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
            </span>
            <span className="badge badge-secondary font-bold">
              {health.acknowledged}
            </span>
          </Link>

          <Link
            to="/orders?status=In+Progress"
            className="flex justify-between items-center text-sm p-3 bg-base-200/50 hover:bg-base-200 rounded-xl transition-colors group cursor-pointer"
          >
            <span className="font-semibold text-base-content/80 group-hover:text-primary flex items-center gap-1.5">
              In Progress
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
            </span>
            <span className="badge badge-warning font-bold">
              {health.inProgress}
            </span>
          </Link>

          <Link
            to="/orders?payment=Failed"
            className="flex justify-between items-center text-sm p-3 bg-base-200/50 hover:bg-base-200 rounded-xl transition-colors group cursor-pointer"
          >
            <span className="font-semibold text-base-content/80 group-hover:text-primary flex items-center gap-1.5">
              Failed Payments Needing Attention
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
            </span>
            <span className="badge badge-error font-bold">
              {health.failedPayments}
            </span>
          </Link>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-base-200 flex justify-end">
        <Link
          to="/orders"
          className="btn btn-sm btn-ghost text-primary font-bold gap-1"
        >
          <span>Go to Order Management</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
