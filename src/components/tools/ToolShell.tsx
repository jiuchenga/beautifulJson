// src/components/tools/ToolShell.tsx
import { type ReactNode } from 'react';
import CodeEditor from './CodeEditor';
import CopyButton from '@/components/ui/CopyButton';
import { useToolI18n } from '@/lib/react-i18n';

type EditorLang = 'json' | 'javascript' | 'html' | 'css' | 'xml' | 'sql';

interface ToolShellProps {
  title: string;
  description?: string;
  lang?: string;
  inputEditor?: {
    language?: EditorLang;
    placeholder?: string;
  };
  outputEditor?: {
    language?: EditorLang;
    readOnly?: boolean;
  };
  inputValue: string;
  onInputChange: (value: string) => void;
  outputValue: string;
  options?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  onExecute: () => void;
  onClear?: () => void;
  onSwap?: () => void;
  onExample?: () => void;
  onDownload?: () => void;
  error?: string;
}

export default function ToolShell({
  title,
  description,
  lang,
  inputEditor,
  outputEditor,
  inputValue,
  onInputChange,
  outputValue,
  options,
  actions,
  children,
  onExecute,
  onClear,
  onSwap,
  onExample,
  onDownload,
  error,
}: ToolShellProps) {
  const t = useToolI18n(lang);
  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{description}</p>
        )}
      </div>

      {/* Options area */}
      {options && (
        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
          {options}
        </div>
      )}

      {/* Editors */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[var(--text-secondary)]">{t.input}</label>
            <CopyButton text={inputValue} lang={lang} />
          </div>
          <CodeEditor
            value={inputValue}
            onChange={onInputChange}
            language={inputEditor?.language || 'json'}
            placeholder={inputEditor?.placeholder || t.inputPlaceholder}
            height="350px"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[var(--text-secondary)]">{t.output}</label>
            <CopyButton text={outputValue} lang={lang} />
          </div>
          <CodeEditor
            value={outputValue}
            language={outputEditor?.language || 'json'}
            readOnly={outputEditor?.readOnly !== false}
            placeholder={t.outputPlaceholder}
            height="350px"
          />
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">
          {error}
        </div>
      )}

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onExecute}
          className="rounded-lg bg-[var(--accent-blue)] px-6 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          {t.execute}
        </button>
        {onClear && (
          <button
            onClick={onClear}
            className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            {t.clear}
          </button>
        )}
        {onExample && (
          <button
            onClick={onExample}
            className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            {t.example}
          </button>
        )}
        {onSwap && (
          <button
            onClick={onSwap}
            className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            {t.swap}
          </button>
        )}
        {onDownload && (
          <button
            onClick={onDownload}
            className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            {t.download}
          </button>
        )}
        {actions}
      </div>

      {/* Additional content (e.g., type analysis, stats) */}
      {children}
    </div>
  );
}
