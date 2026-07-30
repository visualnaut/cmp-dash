import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import queryString from 'query-string';
import { OrderStatus, PaymentStatus } from '../types/order';
import { SortColumn, SortDirection } from '../features/orders/components/OrderTable';

export interface UrlFiltersState {
  searchTerm: string;
  statusFilters: OrderStatus[];
  serviceFilters: string[];
  paymentFilters: PaymentStatus[];
  needsAttentionOnly: boolean;
  currentPage: number;
  pageSize: number;
  sortColumn: SortColumn | null;
  sortDirection: SortDirection;
}

function parseUrlFilters(searchParamsString: string): UrlFiltersState {
  const parsed = queryString.parse(searchParamsString, {
    arrayFormat: 'comma',
    parseBooleans: true,
    parseNumbers: true,
  });

  const searchTerm = typeof parsed.search === 'string' ? parsed.search : '';

  let statusFilters: OrderStatus[] = [];
  if (typeof parsed.status === 'string' && parsed.status.trim()) {
    statusFilters = parsed.status.split(',') as OrderStatus[];
  } else if (Array.isArray(parsed.status)) {
    statusFilters = parsed.status as OrderStatus[];
  }

  let serviceFilters: string[] = [];
  if (typeof parsed.service === 'string' && parsed.service.trim()) {
    serviceFilters = parsed.service.split(',');
  } else if (Array.isArray(parsed.service)) {
    serviceFilters = parsed.service as string[];
  }

  let paymentFilters: PaymentStatus[] = [];
  if (typeof parsed.payment === 'string' && parsed.payment.trim()) {
    paymentFilters = parsed.payment.split(',') as PaymentStatus[];
  } else if (Array.isArray(parsed.payment)) {
    paymentFilters = parsed.payment as PaymentStatus[];
  }

  const needsAttentionOnly = Boolean(parsed.attention);

  const currentPage = typeof parsed.page === 'number' && parsed.page > 0 ? parsed.page : 1;
  const pageSize = typeof parsed.pageSize === 'number' && parsed.pageSize > 0 ? parsed.pageSize : 10;

  const sortColumn =
    parsed.sortBy === 'id' || parsed.sortBy === 'amount' || parsed.sortBy === 'orderTime'
      ? (parsed.sortBy as SortColumn)
      : null;

  const sortDirection =
    parsed.sortDir === 'asc' || parsed.sortDir === 'desc'
      ? (parsed.sortDir as SortDirection)
      : null;

  return {
    searchTerm,
    statusFilters,
    serviceFilters,
    paymentFilters,
    needsAttentionOnly,
    currentPage,
    pageSize,
    sortColumn,
    sortDirection,
  };
}

export function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: UrlFiltersState = useMemo(() => {
    return parseUrlFilters(searchParams.toString());
  }, [searchParams]);

  const updateFilters = useCallback(
    (newFilters: Partial<UrlFiltersState>) => {
      // Always parse fresh from current searchParams to avoid stale closure state
      const current = parseUrlFilters(searchParams.toString());
      const merged = { ...current, ...newFilters };

      const queryObj: Record<string, unknown> = {};

      if (merged.searchTerm && merged.searchTerm.trim()) {
        queryObj.search = merged.searchTerm.trim();
      }
      if (merged.statusFilters && merged.statusFilters.length > 0) {
        queryObj.status = merged.statusFilters.join(',');
      }
      if (merged.serviceFilters && merged.serviceFilters.length > 0) {
        queryObj.service = merged.serviceFilters.join(',');
      }
      if (merged.paymentFilters && merged.paymentFilters.length > 0) {
        queryObj.payment = merged.paymentFilters.join(',');
      }
      if (merged.needsAttentionOnly) {
        queryObj.attention = true;
      }
      if (merged.currentPage > 1) {
        queryObj.page = merged.currentPage;
      }
      if (merged.pageSize !== 10) {
        queryObj.pageSize = merged.pageSize;
      }
      if (merged.sortColumn) {
        queryObj.sortBy = merged.sortColumn;
      }
      if (merged.sortDirection) {
        queryObj.sortDir = merged.sortDirection;
      }

      const stringified = queryString.stringify(queryObj);
      setSearchParams(new URLSearchParams(stringified), { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return {
    filters,
    updateFilters,
    resetFilters,
  };
}
