import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search by guest name, order ID (ORD-1001), or room (204)...',
}) => {
  return (
    <form 
      className="flex gap-2 flex-1"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
    >
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base-content/40" aria-hidden="true">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Search orders by guest name, order ID, or room number"
          className="input input-sm sm:input-md w-full pl-10 pr-9 bg-base-100 border-base-300 rounded-xl text-sm focus:outline-none focus:border-primary shadow-xs"
        />
        {value && (
          <button
            onClick={() => {
              onChange('');
              onSubmit('');
            }}
            aria-label="Clear search input"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40 hover:text-base-content"
            type="button"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <button type="submit" className="btn btn-sm sm:btn-md btn-primary">
        Search
      </button>
    </form>
  );
};
