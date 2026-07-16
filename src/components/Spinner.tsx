export default function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }} className="skeleton" />
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: 320 }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex-col gap-8">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 52 }} />
      ))}
    </div>
  );
}
