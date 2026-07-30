import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useOrders, useServiceTypes, useUpdateOrderStatus } from '../../hooks/useOrders';
import { useDebounce } from '../../hooks/useDebounce';
import { useUrlFilters } from '../../hooks/useUrlFilters';
import { Order, OrderStatus } from '../../types/order';
import { SearchBar } from './components/SearchBar';
import { OrderFilters } from './components/OrderFilters';
import { OrderTable, SortColumn } from './components/OrderTable';
import { OrderDrawer } from './components/OrderDrawer';
import { Pagination } from '../../components/ui/Pagination';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { EmptyState } from '../../components/feedback/EmptyState';
import { SectionErrorBoundary } from '../../components/feedback/SectionErrorBoundary';
import { isSLABreached } from '../../lib/sla';
import { RefreshCw } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { filters, updateFilters, resetFilters } = useUrlFilters();

  // Queries & Mutations
  const { data: orders = [], isLoading, isFetching, isError, error, refetch } = useOrders();
  const { data: availableServices = [] } = useServiceTypes();
  const updateStatusMutation = useUpdateOrderStatus();

  // Local Search state for responsive typing, debounced into URL params
  const [localSearch, setLocalSearch] = useState(filters.searchTerm);
  const debouncedSearch = useDebounce(localSearch, 250);

  // Sync debounced search to URL params when user finishes typing
  useEffect(() => {
    if (debouncedSearch !== filters.searchTerm && localSearch === debouncedSearch) {
      updateFilters({ searchTerm: debouncedSearch, currentPage: 1 });
    }
  }, [debouncedSearch, localSearch, filters.searchTerm, updateFilters]);

  // Keep local search input synced if URL search changes externally (e.g. back button or reset)
  useEffect(() => {
    setLocalSearch(filters.searchTerm);
  }, [filters.searchTerm]);

  // Selected Order for Drawer & Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.statusFilters.length > 0) count++;
    if (filters.serviceFilters.length > 0) count++;
    if (filters.paymentFilters.length > 0) count++;
    if (filters.needsAttentionOnly) count++;
    if (filters.searchTerm.trim() !== '') count++;
    return count;
  }, [filters]);

  const handleResetFilters = () => {
    resetFilters();
  };

  // Tri-state Sort Toggle Handler: None -> ASC -> DESC -> None
  const handleSortChange = (column: SortColumn) => {
    if (filters.sortColumn !== column) {
      updateFilters({ sortColumn: column, sortDirection: 'asc', currentPage: 1 });
    } else if (filters.sortDirection === 'asc') {
      updateFilters({ sortColumn: column, sortDirection: 'desc', currentPage: 1 });
    } else if (filters.sortDirection === 'desc') {
      updateFilters({ sortColumn: null, sortDirection: null, currentPage: 1 });
    } else {
      updateFilters({ sortColumn: column, sortDirection: 'asc', currentPage: 1 });
    }
  };

  // Filtered and Sorted Orders calculation
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const query = filters.searchTerm.trim().toLowerCase();

    // Default sorting when sortColumn is null is orderTime desc (newest first)
    const column = filters.sortColumn || 'orderTime';
    const direction = filters.sortDirection || 'desc';

    return orders
      .filter((order) => {
        if (query) {
          const matchId = order.id.toLowerCase().includes(query);
          const matchGuest = order.guestName.toLowerCase().includes(query);
          const matchRoom = order.roomNumber.toLowerCase().includes(query);
          if (!matchId && !matchGuest && !matchRoom) return false;
        }

        if (filters.statusFilters.length > 0 && !filters.statusFilters.includes(order.status)) {
          return false;
        }

        if (filters.serviceFilters.length > 0 && !filters.serviceFilters.includes(order.service)) {
          return false;
        }

        if (filters.paymentFilters.length > 0 && !filters.paymentFilters.includes(order.paymentStatus)) {
          return false;
        }

        if (filters.needsAttentionOnly && !isSLABreached(order, now)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let res = 0;
        if (column === 'id') {
          res = a.id.localeCompare(b.id);
        } else if (column === 'amount') {
          res = a.amount - b.amount;
        } else if (column === 'orderTime') {
          res = new Date(a.orderTime).getTime() - new Date(b.orderTime).getTime();
        }

        return direction === 'asc' ? res : -res;
      });
  }, [orders, filters]);

  // Paginated Orders Slicing
  const totalPages = Math.ceil(filteredOrders.length / filters.pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (filters.currentPage - 1) * filters.pageSize;
    return filteredOrders.slice(start, start + filters.pageSize);
  }, [filteredOrders, filters.currentPage, filters.pageSize]);

  // Handlers
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const handleQuickUpdateStatus = (id: string, newStatus: OrderStatus) => {
    updateStatusMutation.mutate(
      { id, status: newStatus },
      {
        onSuccess: (updated) => {
          if (selectedOrder?.id === id) {
            setSelectedOrder(updated);
          }
        },
      }
    );
  };

  const handleRequestCancel = (order: Order) => {
    setOrderToCancel(order);
  };

  const handleConfirmCancel = () => {
    if (!orderToCancel) return;
    updateStatusMutation.mutate(
      { id: orderToCancel.id, status: 'Cancelled' },
      {
        onSuccess: () => {
          if (selectedOrder?.id === orderToCancel.id) {
            setSelectedOrder((prev) => (prev ? { ...prev, status: 'Cancelled' } : null));
          }
          setOrderToCancel(null);
        },
      }
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
            Order Management
          </h1>
          <p className="text-sm text-base-content/60 font-medium mt-1">
            Monitor, triage, and update guest service requests
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="Refresh order data"
            className="btn btn-sm btn-ghost border border-base-300 text-base-content/80 hover:text-base-content gap-2 rounded-xl font-semibold shadow-xs disabled:opacity-60"
            title="Refresh order data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-primary' : ''}`} aria-hidden="true" />
            <span>{isFetching ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Search & Multi-Select Filters */}
      <div className="space-y-3">
        <SearchBar value={localSearch} onChange={setLocalSearch} />

        <OrderFilters
          statusFilters={filters.statusFilters}
          onStatusFiltersChange={(statusFilters) => updateFilters({ statusFilters, currentPage: 1 })}
          serviceFilters={filters.serviceFilters}
          onServiceFiltersChange={(serviceFilters) => updateFilters({ serviceFilters, currentPage: 1 })}
          paymentFilters={filters.paymentFilters}
          onPaymentFiltersChange={(paymentFilters) => updateFilters({ paymentFilters, currentPage: 1 })}
          needsAttentionOnly={filters.needsAttentionOnly}
          onNeedsAttentionOnlyToggle={() => updateFilters({ needsAttentionOnly: !filters.needsAttentionOnly, currentPage: 1 })}
          availableServices={availableServices}
          onReset={handleResetFilters}
          activeFilterCount={activeFilterCount}
        />
      </div>

      {/* Main Table Content Area wrapped in SectionErrorBoundary */}
      <SectionErrorBoundary title="Orders Table Error" onReset={() => refetch()}>
        {isLoading ? (
          <LoadingState message="Loading orders..." rows={8} />
        ) : isError ? (
          <ErrorState
            title="Unable to load orders"
            message={error instanceof Error ? error.message : 'An error occurred fetching orders.'}
            onRetry={() => refetch()}
          />
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            title="No orders found"
            message={
              activeFilterCount > 0
                ? 'No guest orders match your active search and filter options.'
                : 'There are currently no orders in the system.'
            }
            actionLabel={activeFilterCount > 0 ? 'Clear Filters & Search' : undefined}
            onAction={handleResetFilters}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-base-content/60 font-semibold px-1">
              <span aria-live="polite">
                Showing {filteredOrders.length} matching order{filteredOrders.length === 1 ? '' : 's'} (Page {filters.currentPage} of {totalPages})
              </span>
              <span>Click any order row to open detail drawer</span>
            </div>

            <OrderTable
              orders={paginatedOrders}
              selectedOrderId={selectedOrder?.id}
              onSelectOrder={handleSelectOrder}
              sortColumn={filters.sortColumn}
              sortDirection={filters.sortDirection}
              onSortChange={handleSortChange}
            />

            <Pagination
              currentPage={filters.currentPage}
              totalPages={totalPages}
              pageSize={filters.pageSize}
              totalItems={filteredOrders.length}
              onPageChange={(page) => updateFilters({ currentPage: page })}
              onPageSizeChange={(newSize) => updateFilters({ pageSize: newSize, currentPage: 1 })}
            />
          </div>
        )}
      </SectionErrorBoundary>

      {/* Order Drawer for Quick Triage */}
      <OrderDrawer
        order={selectedOrder}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdateStatus={(id, status) => handleQuickUpdateStatus(id, status)}
        onRequestCancel={handleRequestCancel}
        onExpandDetail={(id) => {
          setIsDrawerOpen(false);
          navigate(`/orders/${id}`);
        }}
        isUpdating={updateStatusMutation.isPending}
      />

      {/* Confirmation Modal for Destructive Order Cancellation */}
      <ConfirmModal
        isOpen={Boolean(orderToCancel)}
        title="Cancel Order Confirmation"
        message={
          orderToCancel
            ? `Are you sure you want to cancel ${orderToCancel.id} for guest ${orderToCancel.guestName} (Room ${orderToCancel.roomNumber})? This action cannot be undone.`
            : ''
        }
        confirmLabel="Yes, Cancel Order"
        cancelLabel="Keep Order"
        isDanger={true}
        isLoading={updateStatusMutation.isPending}
        onConfirm={handleConfirmCancel}
        onCancel={() => setOrderToCancel(null)}
      />
    </div>
  );
};
