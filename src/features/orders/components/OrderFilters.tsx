import React from 'react';
import { OrderStatus, PaymentStatus } from '../../../types/order';
import { ChecklistDropdown } from '../../../components/ui/ChecklistDropdown';
import { Filter, RotateCcw, AlertCircle } from 'lucide-react';

interface OrderFiltersProps {
  statusFilters: OrderStatus[];
  onStatusFiltersChange: (statuses: OrderStatus[]) => void;
  serviceFilters: string[];
  onServiceFiltersChange: (services: string[]) => void;
  paymentFilters: PaymentStatus[];
  onPaymentFiltersChange: (payments: PaymentStatus[]) => void;
  needsAttentionOnly: boolean;
  onNeedsAttentionOnlyToggle: () => void;
  availableServices: string[];
  onReset: () => void;
  activeFilterCount: number;
}

const ALL_STATUSES: OrderStatus[] = ['New', 'Acknowledged', 'In Progress', 'Completed', 'Cancelled'];
const ALL_PAYMENTS: PaymentStatus[] = ['Paid', 'Pending', 'Failed'];

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  statusFilters,
  onStatusFiltersChange,
  serviceFilters,
  onServiceFiltersChange,
  paymentFilters,
  onPaymentFiltersChange,
  needsAttentionOnly,
  onNeedsAttentionOnlyToggle,
  availableServices,
  onReset,
  activeFilterCount,
}) => {
  return (
    <div className="bg-base-100 p-4 rounded-2xl border border-base-200 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-base-content/60">
          <Filter className="w-4 h-4 text-primary" aria-hidden="true" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="badge badge-sm badge-primary font-bold" aria-label={`${activeFilterCount} active filters`}>
              {activeFilterCount} active
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            aria-label="Reset all filters"
            className="btn btn-xs btn-ghost text-rose-600 hover:bg-rose-50 gap-1 rounded-lg font-semibold"
          >
            <RotateCcw className="w-3 h-3" aria-hidden="true" />
            Reset All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Order Status Multi-Select Checklist */}
        <ChecklistDropdown
          label="Status"
          options={ALL_STATUSES}
          selected={statusFilters}
          onChange={(updated) => onStatusFiltersChange(updated as OrderStatus[])}
        />

        {/* Service Type Multi-Select Checklist */}
        <ChecklistDropdown
          label="Service"
          options={availableServices}
          selected={serviceFilters}
          onChange={onServiceFiltersChange}
        />

        {/* Payment Status Multi-Select Checklist */}
        <ChecklistDropdown
          label="Payment"
          options={ALL_PAYMENTS}
          selected={paymentFilters}
          onChange={(updated) => onPaymentFiltersChange(updated as PaymentStatus[])}
        />

        {/* Needs Attention Quick Filter */}
        <div className="space-y-1 flex flex-col justify-end">
          <label className="text-xs font-semibold text-base-content/70 hidden lg:block">
            Priority
          </label>
          <button
            type="button"
            onClick={onNeedsAttentionOnlyToggle}
            aria-pressed={needsAttentionOnly}
            aria-label="Filter orders needing attention only"
            className={`btn btn-sm rounded-xl font-bold text-xs justify-start gap-2 border transition-all ${
              needsAttentionOnly
                ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-600 shadow-sm'
                : 'btn-outline border-base-300 text-base-content/70 hover:bg-base-200'
            }`}
          >
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" aria-hidden="true" />
            <span>Needs Attention Only</span>
          </button>
        </div>
      </div>
    </div>
  );
};
