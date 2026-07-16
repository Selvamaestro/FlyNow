import { useEffect, useState } from 'react';

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []): { data: T | null; loading: boolean; error: string | null; reload: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fn()
      .then((d) => { if (active) { setData(d); setError(null); } })
      .catch((e) => { if (active) setError(e.message || String(e)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  return { data, loading, error, reload: () => setTick((t) => t + 1) };
}
