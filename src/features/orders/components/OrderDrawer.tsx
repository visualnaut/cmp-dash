import React, { useEffect } from "react";
import { Order, OrderStatus } from "../../../types/order";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { PaymentBadge } from "../../../components/ui/PaymentBadge";
import { AttentionBadge } from "../../../components/ui/AttentionBadge";
import { isSLABreached, formatTimeAgo } from "../../../lib/sla";
import { getNextStatuses, canCancel } from "../../../lib/order-state-machine";
import {
  X,
  Maximize2,
  Clock,
  User,
  DoorClosed,
  DollarSign,
  Package,
  AlertCircle,
} from "lucide-react";

interface OrderDrawerProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onRequestCancel: (order: Order) => void;
  onExpandDetail: (id: string) => void;
  isUpdating?: boolean;
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onRequestCancel,
  onExpandDetail,
  isUpdating = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const now = new Date();
  const isBreached = isSLABreached(order, now);
  const allowedNextStatuses = getNextStatuses(order.status).filter(
    (s) => s !== "Cancelled",
  );
  const showCancelButton = canCancel(order.status);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-order-id"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-base-100 shadow-2xl border-l border-base-200 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-6 border-b border-base-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  id="drawer-order-id"
                  className="font-extrabold text-xl text-base-content"
                >
                  {order.id}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-base-200 font-bold text-xs">
                  {order.roomNumber}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onExpandDetail(order.id)}
                  aria-label={`Expand details for order ${order.id} to full page`}
                  className="btn btn-sm btn-ghost btn-circle text-base-content/70 hover:text-primary"
                  title="Expand to Full Order Detail Page"
                >
                  <Maximize2 className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close order details drawer"
                  className="btn btn-sm btn-ghost btn-circle text-base-content/50 hover:text-base-content"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Attention Alert banner if breached */}
            {isBreached && (
              <div
                role="region"
                aria-live="assertive"
                className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between"
              >
                <AttentionBadge />
                <span className="text-[11px] text-rose-700 font-semibold">
                  Requires attention
                </span>
              </div>
            )}
          </div>

          {/* Drawer Body / Details */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Status overview badges */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-base-200/50 rounded-2xl">
              <div>
                <span className="text-[11px] font-bold text-base-content/50 uppercase tracking-wider block mb-1">
                  Order Status
                </span>
                <StatusBadge status={order.status} size="lg" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-base-content/50 uppercase tracking-wider block mb-1">
                  Payment Status
                </span>
                <PaymentBadge status={order.paymentStatus} size="lg" />
              </div>
            </div>

            {/* Guest & Order Info Grid */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/50">
                Order Information
              </h4>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 bg-base-200 rounded-lg text-base-content/60"
                    aria-hidden="true"
                  >
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-base-content/60 font-medium">
                      Guest Name
                    </p>
                    <p className="font-bold text-base-content">
                      {order.guestName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className="p-2 bg-base-200 rounded-lg text-base-content/60"
                    aria-hidden="true"
                  >
                    <DoorClosed className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-base-content/60 font-medium">
                      Room Number
                    </p>
                    <p className="font-bold text-base-content">
                      {order.roomNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className="p-2 bg-base-200 rounded-lg text-base-content/60"
                    aria-hidden="true"
                  >
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-base-content/60 font-medium">
                      Requested Service
                    </p>
                    <p className="font-bold text-base-content">
                      {order.service}{" "}
                      <span className="font-normal text-base-content/60">
                        (Qty: {order.quantity})
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className="p-2 bg-base-200 rounded-lg text-base-content/60"
                    aria-hidden="true"
                  >
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-base-content/60 font-medium">
                      Total Amount
                    </p>
                    <p className="font-extrabold text-base-content">
                      {order.amount === 0 ? (
                        <span className="text-emerald-600">
                          Complimentary ($0)
                        </span>
                      ) : (
                        `$${order.amount}`
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className="p-2 bg-base-200 rounded-lg text-base-content/60"
                    aria-hidden="true"
                  >
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-base-content/60 font-medium">
                      Order Placed At
                    </p>
                    <p className="font-bold text-base-content">
                      {new Date(order.orderTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      ({formatTimeAgo(order.orderTime, now)})
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Request */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/50">
                Special Request / Instructions
              </h4>
              <div className="p-4 bg-base-200/60 rounded-xl text-sm italic text-base-content/80 border border-base-200">
                {order.specialRequest ? (
                  `"${order.specialRequest}"`
                ) : (
                  <span className="text-base-content/40 not-italic">
                    No special request provided for this order.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-6 border-t border-base-200 bg-base-100 space-y-3">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-base-content/60">
                Operational Actions
              </p>
              <div className="flex flex-col gap-2">
                {allowedNextStatuses.map((nextStatus) => (
                  <button
                    key={nextStatus}
                    type="button"
                    disabled={isUpdating}
                    onClick={() => onUpdateStatus(order.id, nextStatus)}
                    aria-label={`Move order ${order.id} status to ${nextStatus}`}
                    className="btn btn-primary font-bold w-full rounded-xl gap-2 shadow-xs"
                  >
                    {isUpdating && (
                      <span
                        className="loading loading-spinner loading-xs"
                        aria-hidden="true"
                      />
                    )}
                    Move Order to &quot;{nextStatus}&quot;
                  </button>
                ))}

                {showCancelButton && (
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => onRequestCancel(order)}
                    aria-label={`Cancel order ${order.id}`}
                    className="btn btn-ghost hover:bg-rose-50 text-rose-600 font-semibold w-full rounded-xl gap-2 text-xs"
                  >
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    Cancel Order...
                  </button>
                )}
              </div>
            </div>

            {/* Expand to Detail Page */}
            <button
              type="button"
              onClick={() => onExpandDetail(order.id)}
              aria-label={`Open full detail page for order ${order.id}`}
              className="btn btn-outline btn-sm w-full font-bold rounded-xl gap-2 border-base-300 text-xs mt-2"
            >
              <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
              Open Full Detail Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
