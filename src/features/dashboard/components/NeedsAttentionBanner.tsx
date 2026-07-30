import React from 'react';
import { Link } from 'react-router';
import { AlertCircle } from 'lucide-react';
import { useOrders } from '../../../hooks/useOrders';
import { isSLABreached } from '../../../lib/sla';

export const NeedsAttentionBanner: React.FC = () => {
  const { data: orders = [] } = useOrders();
  
  const attentionCount = orders.filter((o) => isSLABreached(o)).length;

  if (attentionCount === 0) {
    return null;
  }

  return (
    <div className="card bg-rose-500 text-white p-5 rounded-2xl shadow-lg border border-rose-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-white/20 rounded-xl">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div>
          <h3 className="font-extrabold text-base">
            Needs Attention ({attentionCount} {attentionCount === 1 ? 'order' : 'orders'})
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
  );
};
