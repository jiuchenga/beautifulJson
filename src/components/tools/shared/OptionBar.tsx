// src/components/tools/shared/OptionBar.tsx
import type { ReactNode } from 'react';

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
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-2 py-1 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
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
