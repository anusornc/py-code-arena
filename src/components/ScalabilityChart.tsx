import React, { useState } from 'react';
import { TrendingUp, Info } from 'lucide-react';
import { BenchmarkSummary, Competitor } from '../types/benchmark';
import { formatTime } from '../utils/benchmarkEngine';

interface ScalabilityChartProps {
  summary: BenchmarkSummary;
  competitors: Competitor[];
  lang: 'th' | 'en';
}

export const ScalabilityChart: React.FC<ScalabilityChartProps> = ({
  summary,
  competitors,
  lang,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<{ compIdx: number; pointIdx: number } | null>(
    null
  );

  const compMap = new Map(competitors.map((c) => [c.id, c]));

  if (!summary.results || summary.results.length === 0) return null;

  // Gather all unique N values sorted
  const allN = Array.from(
    new Set(
      summary.results.flatMap((r) => r.scalingResults.map((p) => p.n)).filter((n) => n > 0)
    )
  ).sort((a, b) => a - b);

  if (allN.length < 2) return null;

  // Maximum time for normalization
  const maxTime = Math.max(
    ...summary.results.flatMap((r) => r.scalingResults.map((p) => p.timeNs)),
    1
  );

  // Chart dimensions
  const width = 640;
  const height = 260;
  const paddingLeft = 60;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const getX = (nVal: number) => {
    const minN = allN[0];
    const maxN = allN[allN.length - 1];
    if (maxN === minN) return paddingLeft + chartWidth / 2;
    // Logarithmic scale for N usually represents benchmark sweeps best
    const ratio = (Math.log10(nVal) - Math.log10(minN)) / (Math.log10(maxN) - Math.log10(minN) || 1);
    return paddingLeft + ratio * chartWidth;
  };

  const getY = (timeNs: number) => {
    // Linear scale clamped for time
    const ratio = Math.min(1, Math.max(0, timeNs / maxTime));
    return paddingTop + chartHeight - ratio * chartHeight;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-5 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            {lang === 'th'
              ? 'กราฟพฤติกรรมการเติบโตเชิงเวลา (Time Complexity & Scaling Curve)'
              : 'Empirical Scalability & Growth Curve'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'th'
              ? 'สังเกตความชันของเส้นกราฟเมื่อขนาดข้อมูล N โตขึ้น (O(N) กราฟชันคงที่ vs O(N²) กราฟพุ่งชันสูง)'
              : 'Visualizes real-world algorithmic divergence as input scale N increases'}
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {summary.results.map((r) => {
            const comp = compMap.get(r.competitorId);
            return (
              <div key={r.competitorId} className="flex items-center gap-1.5 font-sans">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: comp?.color || '#6366f1' }}
                />
                <span className="text-slate-300 font-medium text-xs">
                  {r.competitorName} ({r.estimatedComplexity})
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[300px] select-none"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingTop + chartHeight * (1 - ratio);
            const val = maxTime * ratio;
            return (
              <g key={ratio}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#334155"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                  opacity={0.4}
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  fill="#94a3b8"
                  fontSize="10"
                  textAnchor="end"
                  fontFamily="monospace"
                >
                  {formatTime(val)}
                </text>
              </g>
            );
          })}

          {/* X axis labels (N sizes) */}
          {allN.map((nVal) => {
            const x = getX(nVal);
            return (
              <g key={nVal}>
                <line
                  x1={x}
                  y1={paddingTop + chartHeight}
                  x2={x}
                  y2={paddingTop + chartHeight + 6}
                  stroke="#64748b"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={paddingTop + chartHeight + 20}
                  fill="#94a3b8"
                  fontSize="11"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  N={nVal >= 1000 ? `${nVal / 1000}k` : nVal}
                </text>
              </g>
            );
          })}

          {/* Data Lines per Competitor */}
          {summary.results.map((res, compIdx) => {
            const comp = compMap.get(res.competitorId);
            const color = comp?.color || '#6366f1';
            const validPoints = res.scalingResults.filter((p) => p.n > 0);

            if (validPoints.length < 2) return null;

            const pathD = validPoints
              .map((p, idx) => {
                const x = getX(p.n);
                const y = getY(p.timeNs);
                return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
              })
              .join(' ');

            return (
              <g key={res.competitorId}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300"
                />

                {/* Point Dots */}
                {validPoints.map((p, pIdx) => {
                  const cx = getX(p.n);
                  const cy = getY(p.timeNs);
                  const isHovered =
                    hoveredIndex?.compIdx === compIdx && hoveredIndex?.pointIdx === pIdx;

                  return (
                    <circle
                      key={pIdx}
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 6 : 4}
                      fill={color}
                      stroke="#0f172a"
                      strokeWidth="2"
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setHoveredIndex({ compIdx, pointIdx: pIdx })}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIndex !== null && (
          <div className="absolute top-2 right-4 bg-slate-950/95 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs z-20 pointer-events-none">
            {(() => {
              const res = summary.results[hoveredIndex.compIdx];
              const pt = res?.scalingResults[hoveredIndex.pointIdx];
              if (!res || !pt) return null;
              return (
                <div>
                  <div className="font-bold text-white">{res.competitorName}</div>
                  <div className="text-slate-400">Scale: N={pt.n.toLocaleString()}</div>
                  <div className="text-emerald-400 font-mono font-semibold mt-1">
                    Time: {formatTime(pt.timeNs)}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
