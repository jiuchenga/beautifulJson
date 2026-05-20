// src/components/tools/shared/OptionBar.tsx
import { useState, useRef, useEffect, type ReactNode } from 'react';
import { useToolI18n } from '@/lib/react-i18n';

interface OptionBarProps {
  children: ReactNode;
  label?: string;
}

export default function OptionBar({ children, label }: OptionBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {label && (
        <span className="text-sm font-medium text-[var(--text-tertiary)]">{label}:</span>
      )}
      {children}
    </div>
  );
}

// Parse <option> children to extract value/label pairs
function parseOptions(children: ReactNode): Array<{ value: string; label: string }> {
  const result: Array<{ value: string; label: string }> = [];
  const process = (child: any) => {
    if (!child) return;
    if (Array.isArray(child)) { child.forEach(process); return; }
    if (typeof child === 'object' && child.type === 'option') {
      const v = child.props.value ?? child.props.children ?? '';
      const l = child.props.children ?? '';
      result.push({ value: String(v), label: String(l) });
    }
  };
  process(children);
  return result;
}

// Custom dropdown component with full theme support
export function StyledSelect({ className = '', children, value, onChange, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const options = parseOptions(children);
  const currentValue = String(value ?? '');
  const selectedLabel = options.find(o => o.value === currentValue)?.label ?? currentValue;
  const t = useToolI18n();

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const handleChange = (newValue: string) => {
    setOpen(false);
    if (onChange) {
      onChange({ target: { value: newValue }, currentTarget: { value: newValue } } as React.ChangeEvent<HTMLSelectElement>);
    }
  };

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`appearance-none rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-2 pr-9 text-left text-sm text-[var(--text-primary)] outline-none transition-all duration-200 focus:border-[var(--accent-blue)] focus:ring-2 focus:ring-[var(--accent-blue-rgb)]/25 hover:border-[var(--accent-blue)] cursor-pointer ${open ? 'border-[var(--accent-blue)] ring-2 ring-[var(--accent-blue-rgb)]/25' : ''} ${className}`}
      >
        {selectedLabel || <span className="text-[var(--text-tertiary)]">{t.selectPlaceholder}</span>}
      </button>
      <svg className={`pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} viewBox="0 0 16 16" fill="currentColor">
        <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z" />
      </svg>
      {open && options.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] py-1 shadow-xl">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => handleChange(opt.value)}
              className={`cursor-pointer px-3 py-2 text-sm transition-colors ${
                opt.value === currentValue
                  ? 'bg-[rgba(var(--accent-blue-rgb),0.15)] text-[var(--accent-blue)] font-medium'
                  : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Reusable select option
export function SelectOption({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | number;
  options: Array<{ label: string; value: string | number }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
      {label}
      <StyledSelect
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </StyledSelect>
    </label>
  );
}

// Reusable checkbox option
export function CheckboxOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-[var(--accent-blue)] focus:ring-[var(--accent-blue)]"
      />
      {label}
    </label>
  );
}
