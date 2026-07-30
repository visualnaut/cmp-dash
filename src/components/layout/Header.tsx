import React from 'react';
import { NavLink } from 'react-router';
import { LayoutDashboard, ClipboardList, Hotel } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header role="banner" className="bg-base-100 border-b border-base-200 sticky top-0 z-30 md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary text-primary-content rounded-lg" aria-hidden="true">
            <Hotel className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-base text-base-content">Grand Luxe</span>
        </div>

        {/* Mobile Navigation Pills */}
        <nav aria-label="Mobile navigation" className="flex items-center gap-1 bg-base-200/80 p-1 rounded-xl">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                isActive
                  ? 'bg-base-100 text-primary shadow-xs'
                  : 'text-base-content/70 hover:text-base-content'
              }`
            }
          >
            <LayoutDashboard className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                isActive
                  ? 'bg-base-100 text-primary shadow-xs'
                  : 'text-base-content/70 hover:text-base-content'
              }`
            }
          >
            <ClipboardList className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Orders</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
