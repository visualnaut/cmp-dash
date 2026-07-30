import React from 'react';
import { useNavigate, Link } from 'react-router';
import { SectionErrorBoundary } from '../../components/feedback/SectionErrorBoundary';
import { MetricsSection } from './components/MetricsSection';
import { TopSellingServicesList } from './components/TopSellingServicesList';
import { OpsHealthCheckSection } from './components/OpsHealthCheckSection';
import { useOpsHealthCheck } from '../../hooks/useDashboard';
import { AlertCircle, ArrowRight } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: health } = useOpsHealthCheck();
  const now = new Date();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-base-content/60 font-medium mt-1">
            Real-time operational summary for today, {now.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => navigate('/orders')}
          className="btn btn-primary font-bold shadow-md rounded-xl gap-2 text-sm"
        >
          <span>Manage Orders {health?.newOrders ? `(${health.newOrders} New)` : ''}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Urgent Attention Alert Card */}
      <div className="card bg-rose-500 text-white p-5 rounded-2xl shadow-lg border border-rose-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-xl">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-extrabold text-base">
              Monitor Orders Needing Immediate Attention (&gt;15 min waiting in New status)
            </h3>
            <p className="text-xs text-white/90">
              Action required to maintain guest satisfaction standards.
            </p>
          </div>
        </div>
        <Link
          to="/orders?attention=true"
          className="btn btn-sm bg-white text-rose-700 hover:bg-rose-50 border-none font-bold rounded-xl shadow-xs"
        >
          Review Priority Orders
        </Link>
      </div>

      {/* 6 Key Operational Metrics Cards Section */}
      <SectionErrorBoundary title="Metrics Overview Error">
        <MetricsSection />
      </SectionErrorBoundary>

      {/* Ranked Top Selling Services & Operational Quick Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionErrorBoundary title="Top Selling Services Error">
          <TopSellingServicesList />
        </SectionErrorBoundary>

        <SectionErrorBoundary title="Operational Health Check Error">
          <OpsHealthCheckSection />
        </SectionErrorBoundary>
      </div>
    </div>
  );
};
