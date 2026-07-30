import React from 'react';
import { useNavigate } from 'react-router';
import { SectionErrorBoundary } from '../../components/feedback/SectionErrorBoundary';
import { MetricsSection } from './components/MetricsSection';
import { TopSellingServicesList } from './components/TopSellingServicesList';
import { OpsHealthCheckSection } from './components/OpsHealthCheckSection';
import { NeedsAttentionBanner } from './components/NeedsAttentionBanner';
import { useOpsHealthCheck } from '../../hooks/useDashboard';
import { ArrowRight } from 'lucide-react';

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
      <NeedsAttentionBanner />

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
