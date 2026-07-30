export type OrderStatus = 'New' | 'Acknowledged' | 'In Progress' | 'Completed' | 'Cancelled';

export type PaymentStatus = 'Paid' | 'Pending' | 'Failed';

export interface Order {
  id: string;
  guestName: string;
  roomNumber: string;
  service: string; // Dynamic service type (e.g., Room Service, Housekeeping, Laundry, Extra Bed, Spa & Massage)
  quantity: number;
  amount: number;
  specialRequest?: string;
  orderTime: string; // ISO 8601 string
  status: OrderStatus;
  paymentStatus: PaymentStatus;
}

export interface OrderFilterParams {
  search?: string;
  statuses?: OrderStatus[];
  services?: string[];
  sortBy?: 'newest' | 'oldest';
}

export interface OrderMetrics {
  activeGuests: number;
  pendingOrders: number;
  revenueToday: number;
  completedToday: number;
  averageOrderValue: number;
  totalOrders: number;
}

export interface TopSellingService {
  service: string;
  count: number;
  totalRevenue: number;
}

export interface OpsHealthCheck {
  newOrders: number;
  acknowledged: number;
  inProgress: number;
  failedPayments: number;
}

export interface DashboardMetrics {
  activeGuests: number;
  pendingOrders: number;
  revenueToday: number;
  completedOrdersToday: number;
  averageOrderValue: number;
  topSellingServices: TopSellingService[];
}

export interface SimulatedErrorConfig {
  orders: boolean;       // fetchOrders, fetchOrder
  metrics: boolean;      // fetchOrderMetrics
  topSelling: boolean;   // fetchTopSellingServices
  opsHealth: boolean;    // fetchOpsHealthCheck
  mutations: boolean;    // updateOrderStatus, updatePaymentStatus
}
