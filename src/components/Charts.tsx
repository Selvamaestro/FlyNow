interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}

export function BarChart({ data, height = 220, color = 'var(--primary)' }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={{ height, display: 'flex', alignItems: 'flex-end', gap: 8, padding: '8px 0' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
          <div style={{ width: '70%', maxWidth: 48, height: `${(d.value / max) * 100}%`, background: color, borderRadius: '6px 6px 0 0', minHeight: 4, transition: 'height 0.5s ease', position: 'relative' }}>
            <span style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>{d.value}</span>
          </div>
          <span className="text-xs text-muted" style={{ textAlign: 'center' }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

interface DonutProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
}

export function DonutChart({ data, size = 180 }: DonutProps) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = size / 2 - 14;
  const circ = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <div className="flex items-center gap-24">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((d, i) => {
          const frac = d.value / total;
          const dash = frac * circ;
          const seg = (
            <circle key={i} cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={d.color} strokeWidth={20}
              strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset} transform={`rotate(-90 ${size / 2} ${size / 2})`} strokeLinecap="round" />
          );
          offset += dash;
          return seg;
        })}
        <text x="50%" y="50%" textAnchor="middle" dy="0.3em" fontSize="20" fontWeight="700" fill="var(--text)">{total}</text>
      </svg>
      <div className="flex-col gap-8">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-8 text-sm">
            <span style={{ width: 12, height: 12, borderRadius: 3, background: d.color }} />
            <span className="text-muted">{d.label}</span>
            <span className="font-semibold">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface LineChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}

export function LineChart({ data, height = 200, color = 'var(--primary)' }: LineChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const w = 100;
  const pts = data.map((d, i) => `${(i / (data.length - 1 || 1)) * w},${100 - (d.value / max) * 90 - 5}`);
  return (
    <div style={{ height, position: 'relative' }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <polygon points={`0,100 ${pts.join(' ')} 100,100`} fill={color} opacity={0.12} />
      </svg>
      <div className="flex justify-between" style={{ marginTop: 8 }}>
        {data.map((d, i) => <span key={i} className="text-xs text-muted">{d.label}</span>)}
      </div>
    </div>
  );
}
