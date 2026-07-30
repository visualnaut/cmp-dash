import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
}) => {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers array with optional ellipsis
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <nav
      aria-label="Table pagination navigation"
      className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-base-100 p-4 rounded-2xl border border-base-200 shadow-xs"
    >
      {/* Range Info & Page Size Selector */}
      <div className="flex items-center gap-4 text-xs font-medium text-base-content/70">
        <span aria-live="polite">
          Showing <span className="font-bold text-base-content">{startItem}</span> to{' '}
          <span className="font-bold text-base-content">{endItem}</span> of{' '}
          <span className="font-bold text-base-content">{totalItems}</span> orders
        </span>

        <div className="flex items-center gap-1.5 border-l border-base-200 pl-4">
          <label htmlFor="pageSizeSelect" className="text-xs text-base-content/60">
            Per page:
          </label>
          <select
            id="pageSizeSelect"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Select number of orders displayed per page"
            className="select select-xs select-bordered rounded-lg text-xs font-semibold"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
          aria-disabled={currentPage === 1}
          className="btn btn-xs sm:btn-sm btn-ghost btn-square rounded-lg border border-base-300 text-base-content/70 hover:text-base-content disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Number Buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (typeof page === 'string') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-xs font-semibold text-base-content/40 select-none"
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                aria-label={`Go to page ${page}`}
                aria-current={isActive ? 'page' : undefined}
                className={`btn btn-xs sm:btn-sm rounded-lg font-bold min-w-[32px] ${
                  isActive
                    ? 'btn-primary shadow-xs'
                    : 'btn-ghost text-base-content/70 hover:text-base-content border border-transparent'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          aria-label="Go to next page"
          aria-disabled={currentPage === totalPages || totalPages === 0}
          className="btn btn-xs sm:btn-sm btn-ghost btn-square rounded-lg border border-base-300 text-base-content/70 hover:text-base-content disabled:opacity-40"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};
