// src/components/tools/json/JsonViewer.tsx
import { useState } from 'react';
import { validateJSON } from '@/lib/json-utils';
import CopyButton from '@/components/ui/CopyButton';

const EXAMPLE = '{"users": [{"id": 1, "name": "Alice", "email": "alice@example.com"}, {"id": 2, "name": "Bob", "email": "bob@example.com"}], "total": 2}';

interface TreeNode {
  key: string;
  value: unknown;
  type: string;
  children?: TreeNode[];
}

function buildTree(obj: unknown, key: string = 'root'): TreeNode {
  if (obj === null) return { key, value: null, type: 'null' };
  if (typeof obj === 'boolean') return { key, value: obj, type: 'boolean' };
  if (typeof obj === 'number') return { key, value: obj, type: 'number' };
  if (typeof obj === 'string') return { key, value: obj, type: 'string' };
  if (Array.isArray(obj)) {
    return {
      key,
      value: obj,
      type: 'array',
      children: obj.map((item, i) => buildTree(item, `[${i}]`)),
    };
  }
  if (typeof obj === 'object') {
    return {
      key,
      value: obj,
      type: 'object',
      children: Object.entries(obj as Record<string, unknown>).map(([k, v]) => buildTree(v, k)),
    };
  }
  return { key, value: String(obj), type: 'string' };
}

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    string: 'text-[var(--accent-green)]',
    number: 'text-[var(--accent-orange)]',
    boolean: 'text-[var(--accent-purple)]',
    null: 'text-[var(--text-tertiary)]',
    array: 'text-[var(--accent-blue)]',
    object: 'text-[var(--accent-blue)]',
  };
  return <span className={`text-xs ${colors[type] || 'text-[var(--text-tertiary)]'}`}>{type}</span>;
}

function TreeLevel({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [collapsed, setCollapsed] = useState(depth > 2);
  const indent = depth * 20;

  if (node.type === 'object' || node.type === 'array') {
    const count = node.children?.length || 0;
    return (
      <div>
        <div
          className="flex cursor-pointer items-center gap-2 rounded px-2 py-0.5 hover:bg-[var(--bg-tertiary)]"
          style={{ paddingLeft: `${indent + 8}px` }}
          onClick={() => setCollapsed(!collapsed)}
        >
          <span className={`text-xs ${collapsed ? 'text-[var(--text-tertiary)]' : 'text-[var(--accent-blue)]'}`}>
            {collapsed ? '▶' : '▼'}
          </span>
          <span className="text-sm text-[var(--accent-blue)]">{node.key}</span>
          <TypeBadge type={node.type} />
          <span className="text-xs text-[var(--text-tertiary)]">{count} items</span>
        </div>
        {!collapsed && node.children?.map((child, i) => (
          <TreeLevel key={i} node={child} depth={depth + 1} />
        ))}
      </div>
    );
  }

  const displayValue = node.type === 'string' ? `"${node.value}"` : String(node.value);

  return (
    <div className="flex items-center gap-2 py-0.5" style={{ paddingLeft: `${indent + 24}px` }}>
      <span className="text-sm text-[var(--text-secondary)]">{node.key}:</span>
      <span className="text-sm text-[var(--text-primary)]">{displayValue}</span>
      <TypeBadge type={node.type} />
    </div>
  );
}

export default function JsonViewer() {
  const [input, setInput] = useState('');
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [error, setError] = useState('');

  function handleView() {
    setError('');
    if (!input.trim()) { setError('Please enter JSON'); return; }
    const validation = validateJSON(input);
    if (!validation.valid) { setError(validation.error || 'Invalid JSON'); return; }
    try {
      const parsed = JSON.parse(input);
      setTree(buildTree(parsed));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">JSON Viewer</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">View JSON in a structured, interactive tree.</p>
      </div>

      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JSON here..."
          className="flex-1 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] h-[200px] resize-none"
        />
      </div>

      <div className="flex gap-2">
        <button onClick={handleView} className="rounded-lg bg-[var(--accent-blue)] px-6 py-2 text-sm font-medium text-white hover:opacity-90">View</button>
        <button onClick={() => setInput(EXAMPLE)} className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Example</button>
        <button onClick={() => { setInput(''); setTree(null); setError(''); }} className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Clear</button>
      </div>

      {error && <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{error}</div>}

      {tree && (
        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--text-secondary)]">Tree View</span>
            <CopyButton text={JSON.stringify(tree.value, null, 2)} />
          </div>
          <TreeLevel node={tree} />
        </div>
      )}
    </div>
  );
}
