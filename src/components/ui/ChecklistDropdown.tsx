import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface ChecklistDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export const ChecklistDropdown: React.FC<ChecklistDropdownProps> = ({
  label,
  options,
  selected,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const isAllSelected = selected.length === 0;

  const handleSelectAll = () => {
    onChange([]); // Empty array represents "ALL"
  };

  const handleToggleOption = (option: string) => {
    let updated: string[];
    if (selected.includes(option)) {
      updated = selected.filter((item) => item !== option);
    } else {
      updated = [...selected, option];
    }

    // If user selected all individual options, auto-revert to "All" (empty array)
    if (updated.length === options.length) {
      onChange([]);
    } else {
      onChange(updated);
    }
  };

  // Button label summary
  const getButtonText = () => {
    if (isAllSelected) {
      return `All ${label}s`;
    }
    if (selected.length === 1) {
      return selected[0];
    }
    if (selected.length === 2) {
      return `${selected[0]}, ${selected[1]}`;
    }
    return `${selected.length} ${label}s selected`;
  };

  return (
    <div ref={containerRef} className="relative inline-block w-full">
      <label className="text-xs font-semibold text-base-content/70 mb-1 block">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Filter by ${label}. Current selection: ${getButtonText()}`}
        className={`btn btn-sm w-full justify-between font-semibold rounded-xl text-xs border transition-all ${
          !isAllSelected
            ? 'btn-primary shadow-xs'
            : 'bg-base-100 border-base-300 text-base-content/80 hover:bg-base-200'
        }`}
      >
        <span className="truncate pr-2">{getButtonText()}</span>
        <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="group"
          aria-label={`${label} options checklist`}
          className="absolute left-0 right-0 mt-1.5 z-40 bg-base-100 border border-base-200 rounded-2xl shadow-xl p-2 space-y-1 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Option: ALL */}
          <button
            type="button"
            onClick={handleSelectAll}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
              isAllSelected
                ? 'bg-primary/10 text-primary font-bold'
                : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
            }`}
          >
            <span>All {label}s</span>
            {isAllSelected && <Check className="w-3.5 h-3.5 text-primary" />}
          </button>

          <div className="my-1 border-t border-base-200" />

          {/* Individual Checkbox Options */}
          {options.map((option) => {
            const isChecked = selected.includes(option);
            return (
              <label
                key={option}
                className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl cursor-pointer select-none transition-colors ${
                  isChecked
                    ? 'bg-base-200 text-base-content font-bold'
                    : 'text-base-content/80 hover:bg-base-200/60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleOption(option)}
                  className="checkbox checkbox-xs checkbox-primary rounded-md"
                />
                <span className="truncate">{option}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};
