// src/components/tools/CodeEditor.tsx
import { useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine, placeholder as cmPlaceholder } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { oneDark } from '@codemirror/theme-one-dark';
import { json } from '@codemirror/lang-json';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { xml } from '@codemirror/lang-xml';
import { sql } from '@codemirror/lang-sql';

type Language = 'json' | 'javascript' | 'html' | 'css' | 'xml' | 'sql';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: Language;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  height?: string;
}

function getLangExtension(lang: Language) {
  switch (lang) {
    case 'json': return json();
    case 'javascript': return javascript();
    case 'html': return html();
    case 'css': return css();
    case 'xml': return xml();
    case 'sql': return sql();
    default: return javascript();
  }
}

// Light theme for CodeMirror
const lightTheme = EditorView.theme({
  '&': {
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-primary)',
  },
  '.cm-content': { caretColor: 'var(--accent-blue)' },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--accent-blue)' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: 'rgb(var(--accent-blue-rgb) / 0.25)',
  },
  '.cm-gutters': {
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-tertiary)',
    borderRight: '1px solid var(--border-primary)',
  },
  '.cm-activeLineGutter': { backgroundColor: 'var(--bg-tertiary)' },
  '.cm-activeLine': { backgroundColor: 'rgb(var(--accent-blue-rgb) / 0.06)' },
  '.cm-placeholder': { color: 'var(--text-tertiary)' },
});

function useIsDark() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const check = () => !document.documentElement.classList.contains('light');
    setDark(check());
    const observer = new MutationObserver(() => setDark(check()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

export default function CodeEditor({
  value,
  onChange,
  language = 'json',
  readOnly = false,
  placeholder = '',
  className = '',
  height = '300px',
}: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const isDark = useIsDark();
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!containerRef.current) return;

    const langExtension = getLangExtension(language);
    const themeExtension = isDark ? oneDark : lightTheme;

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        langExtension,
        themeExtension,
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onChangeRef.current) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
        EditorState.readOnly.of(readOnly),
        EditorView.theme({
          '&': { height },
          '.cm-scroller': { overflow: 'auto' },
        }),
        EditorView.lineWrapping,
        placeholder ? cmPlaceholder(placeholder) : [],
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [language, readOnly, height, isDark]);

  // Sync external value changes
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const currentValue = view.state.doc.toString();
    if (currentValue !== value) {
      view.dispatch({
        changes: { from: 0, to: currentValue.length, insert: value },
      });
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      className={`rounded-lg border border-[var(--border-primary)] overflow-hidden ${className}`}
      style={{ minHeight: height }}
    />
  );
}
