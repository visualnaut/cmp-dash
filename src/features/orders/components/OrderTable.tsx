import React from "react";
import { Order } from "../../../types/order";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { PaymentBadge } from "../../../components/ui/PaymentBadge";
import { AttentionBadge } from "../../../components/ui/AttentionBadge";
import { isSLABreached, formatTimeAgo } from "../../../lib/sla";
import { ArrowUp, ArrowDown, ArrowUpDown, ChevronRight } from "lucide-react";

export type SortColumn = "id" | "orderTime" | "amount";
export type SortDirection = "asc" | "desc" | null;

interface OrderTableProps {
  orders: Order[];
  selectedOrderId?: string | null;
  onSelectOrder: (order: Order) => void;
  sortColumn: SortColumn | null;
  sortDirection: SortDirection;
  onSortChange: (column: SortColumn) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  selectedOrderId,
  onSelectOrder,
  sortColumn,
  sortDirection,
  onSortChange,
}) => {
  const now = new Date();

  const handleKeyDownRow = (order: Order, e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelectOrder(order);
    }
  };

  const renderSortIndicator = (column: SortColumn) => {
    if (sortColumn !== column || !sortDirection) {
      return (
        <ArrowUpDown className="w-3.5 h-3.5 opacity-40 shrink-0 inline ml-1" />
      );
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-primary shrink-0 inline ml-1 font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-primary shrink-0 inline ml-1 font-bold" />
    );
  };

  const getAriaSort = (
    column: SortColumn,
  ): "ascending" | "descending" | "none" => {
    if (sortColumn !== column || !sortDirection) return "none";
    return sortDirection === "asc" ? "ascending" : "descending";
  };

  return (
    <div className="w-full space-y-4">
      {/* Desktop & Tablet Table View */}
      <div className="hidden md:block overflow-x-auto bg-base-100 rounded-2xl border border-base-200 shadow-xs">
        <table
          className="table table-zebra w-full"
          aria-label="Guest service orders table"
        >
          <caption className="sr-only">
            List of guest service orders with details, statuses, and clickable
            sorting
          </caption>
          <thead>
            <tr className="bg-base-200/50 text-xs text-base-content/70 font-bold uppercase tracking-wider select-none">
              {/* Sortable: Order ID */}
              <th
                scope="col"
                aria-sort={getAriaSort("id")}
                onClick={() => onSortChange("id")}
                className="py-3.5 pl-5 cursor-pointer hover:bg-base-200/80 transition-colors"
                title="Click to sort by Order ID (tri-state)"
              >
                <div className="flex items-center gap-1">
                  <span>Order ID</span>
                  {renderSortIndicator("id")}
                </div>
              </th>

              <th scope="col">Guest Name</th>
              <th scope="col">Room</th>
              <th scope="col">Service</th>
              <th scope="col" className="text-center">
                Qty
              </th>

              {/* Sortable: Amount */}
              <th
                scope="col"
                aria-sort={getAriaSort("amount")}
                onClick={() => onSortChange("amount")}
                className="text-right cursor-pointer hover:bg-base-200/80 transition-colors"
                title="Click to sort by Amount (tri-state)"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Amount</span>
                  {renderSortIndicator("amount")}
                </div>
              </th>

              {/* Sortable: Order Time */}
              <th
                scope="col"
                aria-sort={getAriaSort("orderTime")}
                onClick={() => onSortChange("orderTime")}
                className="cursor-pointer hover:bg-base-200/80 transition-colors"
                title="Click to sort by Order Time (tri-state)"
              >
                <div className="flex items-center gap-1">
                  <span>Order Time</span>
                  {renderSortIndicator("orderTime")}
                </div>
              </th>

              <th scope="col">Status</th>
              <th scope="col" className="pr-5">
                Payment
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200 text-xs sm:text-sm">
            {orders.map((order) => {
              const isBreached = isSLABreached(order, now);
              const isSelected = selectedOrderId === order.id;

              return (
                <tr
                  key={order.id}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  aria-label={`Order ${order.id} for ${order.guestName}, Room ${order.roomNumber}, ${order.service}. Status: ${order.status}`}
                  onClick={() => onSelectOrder(order)}
                  onKeyDown={(e) => handleKeyDownRow(order, e)}
                  className={`cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary hover:bg-primary/5 ${
                    isSelected ? "bg-primary/10 font-medium" : ""
                  } ${isBreached ? "bg-rose-50/70 border-l-4 border-l-rose-500" : ""}`}
                >
                  {/* ID & Attention Indicator */}
                  <td className="py-4 pl-5 font-extrabold text-base-content whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span>{order.id}</span>
                      {isBreached && <AttentionBadge />}
                    </div>
                  </td>

                  {/* Guest Name */}
                  <td className="font-semibold text-base-content whitespace-nowrap">
                    {order.guestName}
                  </td>

                  {/* Room Number */}
                  <td className="whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-md bg-base-200 font-bold text-xs">
                      {order.roomNumber}
                    </span>
                  </td>

                  {/* Service */}
                  <td className="font-medium text-base-content/90 whitespace-nowrap">
                    {order.service}
                  </td>

                  {/* Quantity */}
                  <td className="text-center font-bold text-base-content/80 whitespace-nowrap">
                    {order.quantity}
                  </td>

                  {/* Amount */}
                  <td className="text-right font-extrabold text-base-content whitespace-nowrap">
                    {order.amount === 0 ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      `$${order.amount}`
                    )}
                  </td>

                  {/* Order Time */}
                  <td className="text-base-content/70 whitespace-nowrap text-xs">
                    {formatTimeAgo(order.orderTime, now)}
                  </td>

                  {/* Order Status */}
                  <td className="whitespace-nowrap">
                    <StatusBadge status={order.status} />
                  </td>

                  {/* Payment Status */}
                  <td className="whitespace-nowrap pr-5">
                    <PaymentBadge status={order.paymentStatus} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View (<768px) */}
      <div
        className="md:hidden space-y-3"
        role="list"
        aria-label="Guest service orders list"
      >
        {orders.map((order) => {
          const isBreached = isSLABreached(order, now);
          const isSelected = selectedOrderId === order.id;

          return (
            <div
              key={order.id}
              tabIndex={0}
              role="listitem"
              aria-label={`Order ${order.id} for ${order.guestName}, Room ${order.roomNumber}`}
              onClick={() => onSelectOrder(order)}
              onKeyDown={(e) => handleKeyDownRow(order, e)}
              className={`card bg-base-100 p-4 border rounded-2xl shadow-xs space-y-3 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-primary active:scale-[0.99] ${
                isSelected
                  ? "ring-2 ring-primary border-primary"
                  : "border-base-200"
              } ${isBreached ? "bg-rose-50/80 border-rose-300 border-l-4 border-l-rose-500" : ""}`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-base-content">
                      {order.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-base-200 font-bold text-xs">
                      {order.roomNumber}
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-base-content mt-0.5">
                    {order.guestName}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-base text-base-content">
                    {order.amount === 0 ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      `$${order.amount}`
                    )}
                  </span>
                  <p className="text-[11px] text-base-content/60 font-medium">
                    {formatTimeAgo(order.orderTime, now)}
                  </p>
                </div>
              </div>

              {/* Needs Attention Warning */}
              {isBreached && <AttentionBadge />}

              {/* Service & Qty */}
              <div className="flex justify-between items-center text-xs p-2.5 bg-base-200/50 rounded-xl">
                <span className="font-semibold text-base-content/80">
                  {order.service}
                </span>
                <span className="font-bold text-base-content/70">
                  Qty: {order.quantity}
                </span>
              </div>

              {/* Statuses */}
              <div className="flex items-center justify-between pt-1 border-t border-base-200">
                <div className="flex items-center gap-2">
                  <StatusBadge status={order.status} size="sm" />
                  <PaymentBadge status={order.paymentStatus} size="sm" />
                </div>
                <ChevronRight
                  className="w-5 h-5 text-base-content/40"
                  aria-hidden="true"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
