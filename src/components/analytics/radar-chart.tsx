/**
 * Pure-SVG radar (spider) chart — server-rendered, zero dependencies.
 * seriesA = highlighted country, seriesB = cohort average.
 */
export function RadarChart({
  labels,
  seriesA,
  seriesB,
  size = 340,
}: {
  labels: string[];
  seriesA: number[]; // 0..100
  seriesB?: number[];
  size?: number;
}) {
  const n = labels.length;
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 44;

  const point = (i: number, v: number) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const r = (v / 100) * R;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const;
  };
  const polygon = (values: number[]) =>
    values.map((v, i) => point(i, v).join(',')).join(' ');

  return (
    <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="ACRI radar chart" className="w-full max-w-sm">
      {/* grid rings */}
      {[25, 50, 75, 100].map((ring) => (
        <polygon
          key={ring}
          points={polygon(Array(n).fill(ring))}
          fill="none"
          stroke="#d9e2df"
          strokeWidth={1}
        />
      ))}
      {/* axes + labels */}
      {labels.map((label, i) => {
        const [x, y] = point(i, 100);
        const [lx, ly] = point(i, 122);
        return (
          <g key={label}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="#e3eae7" strokeWidth={1} />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={11}
              fontWeight={700}
              fill="#0D2B4E"
            >
              {label}
            </text>
          </g>
        );
      })}
      {/* cohort average */}
      {seriesB ? (
        <polygon
          points={polygon(seriesB)}
          fill="rgba(201,162,75,0.12)"
          stroke="#C9A24B"
          strokeWidth={1.5}
          strokeDasharray="5 3"
        />
      ) : null}
      {/* country */}
      <polygon
        points={polygon(seriesA)}
        fill="rgba(10,92,54,0.22)"
        stroke="#0A5C36"
        strokeWidth={2}
      />
      {seriesA.map((v, i) => {
        const [x, y] = point(i, v);
        return <circle key={i} cx={x} cy={y} r={3.5} fill="#0A5C36" />;
      })}
    </svg>
  );
}
