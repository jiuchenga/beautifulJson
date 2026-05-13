// src/components/tools/life/Stopwatch.tsx
import { useState, useRef, useCallback } from 'react';

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startStopwatch = useCallback(() => {
    if (running) return;
    setRunning(true);
    const startTime = Date.now() - time;
    intervalRef.current = setInterval(() => setTime(Date.now() - startTime), 10);
  }, [running, time]);

  const stop = useCallback(() => {
    if (!running) return;
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [running]);

  const reset = useCallback(() => {
    setRunning(false);
    setTime(0);
    setLaps([]);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const lap = useCallback(() => {
    if (running) setLaps([...laps, time]);
  }, [running, laps, time]);

  const format = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const cent = Math.floor((ms % 1000) / 10);
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(cent).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Online Stopwatch</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Simple online stopwatch with lap timer.</p>
      </div>

      <div className="flex flex-col items-center gap-6 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-8">
        <span className="font-mono text-6xl font-bold text-[var(--text-primary)] tabular-nums">{format(time)}</span>

        <div className="flex gap-3">
          {!running ? (
            <button onClick={startStopwatch} className="rounded-lg bg-green-600 px-8 py-3 text-sm font-medium text-white hover:opacity-90">{time === 0 ? 'Start' : 'Resume'}</button>
          ) : (
            <button onClick={stop} className="rounded-lg bg-red-600 px-8 py-3 text-sm font-medium text-white hover:opacity-90">Stop</button>
          )}
          <button onClick={lap} disabled={!running} className="rounded-lg bg-[var(--accent-blue)] px-6 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40">Lap</button>
          <button onClick={reset} className="rounded-lg border border-[var(--border-primary)] px-6 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Reset</button>
        </div>
      </div>

      {laps.length > 0 && (
        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
          <h3 className="mb-2 text-sm font-medium text-[var(--text-secondary)]">Laps</h3>
          <div className="space-y-1">
            {laps.map((l, i) => (
              <div key={i} className="flex justify-between rounded px-3 py-1 text-sm hover:bg-[var(--bg-tertiary)]">
                <span className="text-[var(--text-tertiary)]">Lap {i + 1}</span>
                <span className="font-mono text-[var(--text-primary)]">{format(l)}</span>
              </div>
            ))}
            <div className="flex justify-between rounded bg-[var(--bg-tertiary)] px-3 py-1 text-sm font-medium">
              <span className="text-[var(--text-secondary)]">Current</span>
              <span className="font-mono text-[var(--accent-blue)]">{format(time)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
