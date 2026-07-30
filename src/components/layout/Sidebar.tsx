import React from "react";
import { NavLink } from "react-router";
import {
  LayoutDashboard,
  ClipboardList,
  Hotel,
  AlertCircle,
  Settings,
  RotateCcw,
  Moon,
  Sun,
} from "lucide-react";
import { useOrders, useResetOrders } from "../../hooks/useOrders";
import { useTheme } from "../../hooks/useTheme";
import { isSLABreached } from "../../lib/sla";
import { SimulatedErrorConfig } from "../../types/order";

interface SidebarProps {
  errorConfig: SimulatedErrorConfig;
  onToggleErrorConfig: (key: keyof SimulatedErrorConfig) => void;
  onToggleAllErrors: (enabled: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  errorConfig,
  onToggleErrorConfig,
  onToggleAllErrors,
}) => {
  const { data: orders = [] } = useOrders();
  const resetOrdersMutation = useResetOrders();
  const { theme, toggleTheme } = useTheme();

  const attentionCount = orders.filter((o) => isSLABreached(o)).length;
  const pendingCount = orders.filter(
    (o) => o.status === "New" || o.status === "Acknowledged",
  ).length;

  const allActive = Object.values(errorConfig).every(Boolean);

  return (
    <aside
      aria-label="Sidebar navigation"
      className="w-64 bg-base-100 border-r border-base-200 flex flex-col justify-between h-screen sticky top-0 shrink-0 md:flex"
    >
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-base-200 flex items-center gap-3">
          <div
            className="p-2.5 bg-primary text-primary-content rounded-xl shadow-md"
            aria-hidden="true"
          >
            <Hotel className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-base-content tracking-tight leading-tight">
              Grand Luxe
            </h1>
            <p className="text-[11px] text-base-content/60 font-semibold tracking-wider uppercase">
              Staff Operations
            </p>
          </div>
        </div>

        {/* Navigation links */}
        <nav aria-label="Main navigation" className="p-4 space-y-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                isActive
                  ? "bg-primary text-primary-content shadow-sm"
                  : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                isActive
                  ? "bg-primary text-primary-content shadow-sm"
                  : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <ClipboardList className="w-4 h-4" aria-hidden="true" />
              <span>Orders</span>
            </div>
            {pendingCount > 0 && (
              <span
                className="badge badge-sm font-bold bg-amber-500 text-white border-none"
                aria-label={`${pendingCount} pending orders`}
              >
                {pendingCount}
              </span>
            )}
          </NavLink>
        </nav>

        {/* Needs Attention Alert Banner */}
        {attentionCount > 0 && (
          <div
            role="region"
            aria-live="assertive"
            className="mx-4 my-2 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5"
          >
            <AlertCircle
              className="w-5 h-5 text-rose-600 shrink-0 animate-bounce"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs font-bold text-rose-900">
                Needs Attention ({attentionCount})
              </p>
              <p className="text-[11px] text-rose-700">
                Check priority in Orders
              </p>
            </div>
          </div>
        )}
      </div>

      {/* User Info & Hidden Collapsible Developer Tools */}
      <div className="p-4 border-t border-base-200 space-y-3">
        {/* User Card */}
        <div
          className="flex items-center gap-3 px-2 py-1"
          aria-label="Current logged in staff user"
        >
          <div className="avatar placeholder" aria-hidden="true">
            <div className="bg-neutral text-neutral-content rounded-full w-8 font-bold text-xs text-center flex items-center justify-center">
              JD
            </div>
          </div>
          <div className="text-xs flex-1">
            <p className="font-bold text-base-content">Jane Doe</p>
            <p className="text-base-content/50 text-[10px]">Front Desk Staff</p>
          </div>
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="btn btn-circle btn-ghost btn-xs text-base-content/70 hover:text-base-content"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Collapsible Hidden Dev Tools Section */}
        <details className="group border border-base-200 rounded-xl bg-base-200/40 text-xs overflow-hidden">
          <summary className="flex items-center justify-between p-2.5 cursor-pointer font-medium text-base-content/60 hover:text-base-content hover:bg-base-200/80 transition-colors select-none">
            <span className="flex items-center gap-1.5 font-semibold text-[11px]">
              <Settings
                className="w-3.5 h-3.5 text-base-content/50"
                aria-hidden="true"
              />
              Dev Tools
            </span>
            <span className="text-[10px] text-base-content/40 group-open:rotate-180 transition-transform">
              ▼
            </span>
          </summary>

          <div className="p-3 pt-2 border-t border-base-200/60 space-y-3 bg-base-100/60">
            <div>
              <div className="flex items-center justify-between font-bold text-[11px] text-base-content/80 mb-2">
                <span>Simulate Errors:</span>
                <button
                  type="button"
                  onClick={() => onToggleAllErrors(!allActive)}
                  className="text-[10px] text-primary hover:underline font-semibold"
                >
                  {allActive ? "Disable All" : "Enable All"}
                </button>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <label className="flex items-center justify-between cursor-pointer hover:text-base-content text-base-content/70">
                  <span>Orders API</span>
                  <input
                    type="checkbox"
                    checked={errorConfig.orders}
                    onChange={() => onToggleErrorConfig("orders")}
                    className="checkbox checkbox-xs checkbox-error"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer hover:text-base-content text-base-content/70">
                  <span>Metrics API</span>
                  <input
                    type="checkbox"
                    checked={errorConfig.metrics}
                    onChange={() => onToggleErrorConfig("metrics")}
                    className="checkbox checkbox-xs checkbox-error"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer hover:text-base-content text-base-content/70">
                  <span>Top Selling API</span>
                  <input
                    type="checkbox"
                    checked={errorConfig.topSelling}
                    onChange={() => onToggleErrorConfig("topSelling")}
                    className="checkbox checkbox-xs checkbox-error"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer hover:text-base-content text-base-content/70">
                  <span>Ops Health API</span>
                  <input
                    type="checkbox"
                    checked={errorConfig.opsHealth}
                    onChange={() => onToggleErrorConfig("opsHealth")}
                    className="checkbox checkbox-xs checkbox-error"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer hover:text-base-content text-base-content/70">
                  <span>Mutations (Write)</span>
                  <input
                    type="checkbox"
                    checked={errorConfig.mutations}
                    onChange={() => onToggleErrorConfig("mutations")}
                    className="checkbox checkbox-xs checkbox-error"
                  />
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={() => resetOrdersMutation.mutate()}
              disabled={resetOrdersMutation.isPending}
              aria-label="Reset demo dataset to initial state"
              className="btn btn-xs btn-ghost border border-base-300 w-full justify-center gap-1.5 text-[11px] font-medium text-base-content/70 hover:text-base-content rounded-lg"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </details>
      </div>
    </aside>
  );
};
