// src/components/tools/json/JsonTreeView.tsx
import { useState, useCallback } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import { validateJSON } from '@/lib/json-utils';

const EXAMPLE = '{"company": {"name": "DevToolkit", "founded": 2024, "products": [{"id": 1, "name": "JSON Formatter", "users": 50000}, {"id": 2, "name": "QR Generator", "users": 30000}]}, "active": true}';

interface TreeNode {
  key: string;
  value: unknown;
  type: string;
  children?: TreeNode[];
  depth: number;
}

function buildTree(obj: unknown, key: string = 'root', depth: number = 0): TreeNode {
  if (obj === null) return { key, value: null, type: 'null', depth };
  if (Array.isArray(obj)) {
    return { key, value: obj, type: 'array', depth, children: obj.map((item, i) => buildTree(item, `[${i}]`, depth + 1)) };
  }
  if (typeof obj === 'object') {
    const entries = Object.entries(obj as Record<string, unknown>);
    return { key, value: obj, type: 'object', depth, children: entries.map(([k, v]) => buildTree(v, k, depth + 1)) };
  }
  return { key, value: obj, type: typeof obj, depth };
}

function TypeTag({ type }: { type: string }) {
  const colors: Record<string, string> = {
    string: 'bg-[var(--accent-green)]/10 text-[var(--accent-green)]',
    number: 'bg-[var(--accent-orange)]/10 text-[var(--accent-orange)]',
    boolean: 'bg-[var(--accent-purple)]/10 text-[var(--accent-purple)]',
    null: 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]',
    array: 'bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]',
    object: 'bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]',
  };
  return <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${colors[type] || ''}`}>{type}</span>;
}

function TreeRow({ node, onToggle, collapsed }: { node: TreeNode; onToggle: (key: string) => void; collapsed: Set<string> }) {
  const isContainer = node.type === 'object' || node.type === 'array';
  const isCollapsed = collapsed.has(`${node.depth}-${node.key}`);
  const indent = node.depth * 16;

  return (
    <>
      <div className="flex items-center gap-2 rounded px-2 py-0.5 hover:bg-[var(--bg-tertiary)] cursor-pointer" style={{ paddingLeft: `${indent + 4}px` }} onClick={() => isContainer && onToggle(`${node.depth}-${node.key}`)}>
        {isContainer ? (
          <span className="w-4 text-xs text-[var(--text-tertiary)]">{isCollapsed ? '▶' : '▼'}</span>
        ) : (
          <span className="w-4" />
        )}
        <span className="text-sm text-[var(--accent-blue)]">{node.key}</span>
        <TypeTag type={node.type} />
        {!isContainer && (
          <span className="text-sm text-[var(--text-secondary)]">
            {node.type === 'string' ? `"${node.value}"` : String(node.value)}
          </span>
        )}
        {isContainer && (
          <span className="text-xs text-[var(--text-tertiary)]">{node.children?.length || 0} items</span>
        )}
      </div>
      {isContainer && !isCollapsed && node.children?.map((child, i) => (
        <TreeRow key={`${child.depth}-${child.key}-${i}`} node={child} onToggle={onToggle} collapsed={collapsed} />
      ))}
    </>
  );
}

export default function JsonTreeView() {
  const [input, setInput] = useState('');
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');

  const handleToggle = useCallback((key: string) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  function handleView() {
    setError('');
    if (!input.trim()) { setError('Please enter JSON'); return; }
    const validation = validateJSON(input);
    if (!validation.valid) { setError(validation.error || 'Invalid JSON'); return; }
    try {
      setTree(buildTree(JSON.parse(input)));
      setCollapsed(new Set());
    } catch (e) {
      setError((e as Error).message);
    }
  }

  function expandAll() {
    setCollapsed(new Set());
  }

  function collapseAll() {
    if (!tree) return;
    const keys = new Set<string>();
    function walk(node: TreeNode) {
      if (node.type === 'object' || node.type === 'array') {
        keys.add(`${node.depth}-${node.key}`);
        node.children?.forEach(walk);
      }
    }
    walk(tree);
    setCollapsed(keys);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">JSON Tree Viewer</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Interactive tree view with collapse/expand and type info.</p>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your JSON here..."
        className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] h-[200px] resize-none"
      />

      <div className="flex gap-2">
        <button onClick={handleView} className="rounded-lg bg-[var(--accent-blue)] px-6 py-2 text-sm font-medium text-white hover:opacity-90">View Tree</button>
        <button onClick={() => setInput(EXAMPLE)} className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Example</button>
        {tree && <>
          <button onClick={expandAll} className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Expand All</button>
          <button onClick={collapseAll} className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Collapse All</button>
        </>}
        <button onClick={() => { setInput(''); setTree(null); setError(''); }} className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Clear</button>
      </div>

      {error && <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{error}</div>}

      {tree && (
        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--text-secondary)]">Tree View</span>
            <CopyButton text={JSON.stringify(tree.value, null, 2)} />
          </div>
          <TreeRow node={tree} onToggle={handleToggle} collapsed={collapsed} />
        </div>
      )}
    </div>
  );
}
