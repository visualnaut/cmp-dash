import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useOrder, useUpdateOrderStatus, useUpdatePaymentStatus } from '../../hooks/useOrders';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PaymentBadge } from '../../components/ui/PaymentBadge';
import { AttentionBadge } from '../../components/ui/AttentionBadge';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { isSLABreached, getMinutesSinceOrder, formatTimeAgo } from '../../lib/sla';
import { getNextStatuses, canCancel, canMarkPaymentPaid } from '../../lib/order-state-machine';
import { OrderStatus } from '../../types/order';
import {
  ArrowLeft,
  User,
  DoorClosed,
  Package,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Check,
} from 'lucide-react';

const ORDER_STEPS: OrderStatus[] = ['New', 'Acknowledged', 'In Progress', 'Completed'];

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: order, isLoading, isError, error, refetch } = useOrder(id || '');
  const updateStatusMutation = useUpdateOrderStatus();
  const updatePaymentMutation = useUpdatePaymentStatus();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  if (isLoading) {
    return <LoadingState message="Loading order detail view..." rows={6} />;
  }

  if (isError || !order) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate('/orders')}
          className="btn btn-sm btn-ghost gap-2 font-semibold text-base-content/70"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </button>
        <ErrorState
          title="Order Not Found"
          message={error instanceof Error ? error.message : `Order ${id} could not be retrieved.`}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const now = new Date();
  const isBreached = isSLABreached(order, now);
  const minutesElapsed = getMinutesSinceOrder(order, now);
  const allowedNextStatuses = getNextStatuses(order.status).filter((s) => s !== 'Cancelled');
  const showCancelButton = canCancel(order.status);
  const showMarkPaid = canMarkPaymentPaid(order.paymentStatus);

  // Calculate timeline progress
  const currentStepIndex = ORDER_STEPS.indexOf(order.status);

  const handleUpdateStatus = (newStatus: OrderStatus) => {
    updateStatusMutation.mutate({ id: order.id, status: newStatus });
  };

  const handleMarkPaid = () => {
    updatePaymentMutation.mutate({ id: order.id, paymentStatus: 'Paid' });
  };

  const handleConfirmCancel = () => {
    updateStatusMutation.mutate(
      { id: order.id, status: 'Cancelled' },
      {
        onSuccess: () => setIsCancelModalOpen(false),
      }
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/orders')}
          className="btn btn-sm btn-ghost gap-2 font-bold text-base-content/70 hover:text-base-content"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders List</span>
        </button>
        <span className="text-xs text-base-content/50 font-medium">Order Detail View</span>
      </div>

      {/* Attention Alert banner */}
      {isBreached && (
        <div className="card bg-rose-50 border border-rose-200 p-4 rounded-2xl flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <AttentionBadge minutesElapsed={minutesElapsed} />
            <p className="text-xs font-semibold text-rose-800 hidden sm:block">
              This order has been waiting in &quot;New&quot; status for over 15 minutes.
            </p>
          </div>
          <button
            onClick={() => handleUpdateStatus('Acknowledged')}
            disabled={updateStatusMutation.isPending}
            className="btn btn-xs bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg border-none"
          >
            Acknowledge Now
          </button>
        </div>
      )}

      {/* Main Order Header Card */}
      <div className="card bg-base-100 border border-base-200 p-6 rounded-2xl shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-base-200">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
                {order.id}
              </h1>
              <span className="px-3 py-1 rounded-xl bg-base-200 font-extrabold text-xs text-base-content">
                {order.roomNumber}
              </span>
            </div>
            <p className="text-sm font-semibold text-base-content/70 mt-1">
              Guest: <span className="text-base-content font-bold">{order.guestName}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} size="lg" />
            <PaymentBadge status={order.paymentStatus} size="lg" />
          </div>
        </div>

        {/* Order Lifecycle Progress Timeline */}
        {order.status !== 'Cancelled' ? (
          <div className="space-y-3 py-2">
            <p className="text-xs font-bold uppercase tracking-wider text-base-content/50">
              Lifecycle Progress
            </p>
            <div className="grid grid-cols-4 gap-2">
              {ORDER_STEPS.map((stepName, idx) => {
                const isCurrent = order.status === stepName;
                const isPassed = currentStepIndex >= idx;

                return (
                  <div key={stepName} className="space-y-2 text-center">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isCurrent
                          ? 'bg-primary ring-2 ring-primary/30'
                          : isPassed
                          ? 'bg-primary/80'
                          : 'bg-base-200'
                      }`}
                    />
                    <div className="flex items-center justify-center gap-1">
                      {isPassed && <Check className="w-3 h-3 text-primary shrink-0" />}
                      <span
                        className={`text-xs font-bold ${
                          isCurrent
                            ? 'text-primary font-extrabold'
                            : isPassed
                            ? 'text-base-content font-semibold'
                            : 'text-base-content/40'
                        }`}
                      >
                        {stepName}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-100 rounded-xl flex items-center gap-3 text-slate-700">
            <AlertCircle className="w-5 h-5 text-slate-500 shrink-0" />
            <div>
              <p className="font-bold text-sm">Order Cancelled</p>
              <p className="text-xs">This order is in a terminal cancelled state and cannot be processed further.</p>
            </div>
          </div>
        )}

        {/* Detailed Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/50">
              Service Details
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-base-200 rounded-xl text-base-content/70 shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-base-content/50 font-medium">Service Requested</p>
                  <p className="font-extrabold text-base-content text-base">{order.service}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-base-200 rounded-xl text-base-content/70 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-base-content/50 font-medium">Quantity</p>
                  <p className="font-extrabold text-base-content">{order.quantity} unit(s)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-base-200 rounded-xl text-base-content/70 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-base-content/50 font-medium">Order Placed At</p>
                  <p className="font-bold text-base-content">
                    {new Date(order.orderTime).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}{' '}
                    ({formatTimeAgo(order.orderTime, now)})
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/50">
              Financial &amp; Guest Info
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-base-200 rounded-xl text-base-content/70 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-base-content/50 font-medium">Guest Name</p>
                  <p className="font-bold text-base-content">{order.guestName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-base-200 rounded-xl text-base-content/70 shrink-0">
                  <DoorClosed className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-base-content/50 font-medium">Room Location</p>
                  <p className="font-bold text-base-content">{order.roomNumber}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-base-200 rounded-xl text-base-content/70 shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-base-content/50 font-medium">Order Total</p>
                  <p className="font-extrabold text-base text-base-content">
                    {order.amount === 0 ? (
                      <span className="text-emerald-600">Complimentary ($0)</span>
                    ) : (
                      `$${order.amount}`
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Special Request Section */}
        <div className="pt-4 border-t border-base-200 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/50">
            Special Request &amp; Instructions
          </h3>
          <div className="p-4 bg-base-200/50 rounded-2xl text-sm leading-relaxed text-base-content font-medium border border-base-200">
            {order.specialRequest ? (
              `"${order.specialRequest}"`
            ) : (
              <span className="text-base-content/40 italic">No special instructions provided by the guest.</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar Card */}
      <div className="card bg-base-100 border border-base-200 p-6 rounded-2xl shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-base-content">Staff Management Actions</h3>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Advancement Buttons */}
          {allowedNextStatuses.map((nextStatus) => (
            <button
              key={nextStatus}
              onClick={() => handleUpdateStatus(nextStatus)}
              disabled={updateStatusMutation.isPending}
              className="btn btn-primary font-bold shadow-xs rounded-xl gap-2 text-sm"
            >
              {updateStatusMutation.isPending && <span className="loading loading-spinner loading-xs" />}
              Advance Status to &quot;{nextStatus}&quot;
            </button>
          ))}

          {/* Payment Status Action */}
          {showMarkPaid && (
            <button
              onClick={handleMarkPaid}
              disabled={updatePaymentMutation.isPending}
              className="btn bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl gap-2 shadow-xs text-sm border-none"
            >
              {updatePaymentMutation.isPending ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <CreditCard className="w-4 h-4" />
              )}
              Mark Payment as Paid
            </button>
          )}

          {/* Cancellation Button */}
          {showCancelButton && (
            <button
              onClick={() => setIsCancelModalOpen(true)}
              disabled={updateStatusMutation.isPending}
              className="btn btn-ghost hover:bg-rose-50 text-rose-600 font-bold rounded-xl gap-2 text-sm ml-auto"
            >
              <AlertCircle className="w-4 h-4" />
              Cancel Order...
            </button>
          )}
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      <ConfirmModal
        isOpen={isCancelModalOpen}
        title="Cancel Order Confirmation"
        message={`Are you sure you want to cancel order ${order.id}? This action is permanent and cannot be reversed.`}
        confirmLabel="Yes, Cancel Order"
        cancelLabel="Keep Order Active"
        isDanger={true}
        isLoading={updateStatusMutation.isPending}
        onConfirm={handleConfirmCancel}
        onCancel={() => setIsCancelModalOpen(false)}
      />
    </div>
  );
};
