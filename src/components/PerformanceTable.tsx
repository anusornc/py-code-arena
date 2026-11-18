import React, { useState } from 'react';
import {
  Trophy,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Zap,
  HardDrive,
  Activity,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Eye,
  FileCode,
} from 'lucide-react';
import { BenchmarkSummary, Competitor, CompetitorResult } from '../types/benchmark';
import { formatTime, formatBytes } from '../utils/benchmarkEngine';

interface PerformanceTableProps {
  summary: BenchmarkSummary;
  competitors: Competitor[];
  lang: 'th' | 'en';
  onSelectCompetitor?: (id: string) => void;
}

type SortField = 'rank' | 'meanTime' | 'medianTime' | 'minTime' | 'maxTime' | 'memory' | 'speedup';

export const PerformanceTable: React.FC<PerformanceTableProps> = ({
  summary,
  competitors,
  lang,
  onSelectCompetitor,
}) => {
  const [sortField, setSortField] = useState<SortField>('meanTime');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const compMap = new Map(competitors.map((c) => [c.id, c]));

  // Find baseline fastest mean time
  const baselineFastest =
    Math.min(...summary.results.map((r) => r.meanTimeNs).filter((t) => t > 0)) || 1;

  // Find lowest peak memory
  const lowestMemory =
    Math.min(...summary.results.map((r) => r.peakMemoryBytes).filter((m) => m > 0)) || 1;

  // Sorting handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedResults = [...summary.results].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'meanTime':
        comparison = a.meanTimeNs - b.meanTimeNs;
        break;
      case 'medianTime':
        comparison = a.medianTimeNs - b.medianTimeNs;
        break;
      case 'minTime':
        comparison = a.minTimeNs - b.minTimeNs;
        break;
      case 'maxTime':
        comparison = a.maxTimeNs - b.maxTimeNs;
        break;
      case 'memory':
        comparison = a.peakMemoryBytes - b.peakMemoryBytes;
        break;
      case 'speedup':
        comparison = a.meanTimeNs / baselineFastest - b.meanTimeNs / baselineFastest;
        break;
      case 'rank':
      default:
        comparison = a.meanTimeNs - b.meanTimeNs;
        break;
    }
    return sortAsc ? comparison : -comparison;
  });

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-500" />;
    }
    return sortAsc ? (
      <ArrowUp className="w-3 h-3 text-emerald-400" />
    ) : (
      <ArrowDown className="w-3 h-3 text-emerald-400" />
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden mb-6">
      {/* Table Header / Action Banner */}
      <div className="p-4 sm:px-6 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-slate-900/60">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            {lang === 'th'
              ? 'ตารางเปรียบเทียบประสิทธิภาพโค้ดและทรัพยากร'
              : 'Performance & Resource Benchmark Table'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'th'
              ? 'คลิกหัวคอลัมน์เพื่อเรียงลำดับ | ตัวเลขเวลาเฉลี่ยยิ่งน้อยยิ่งเร็ว แรมยิ่งน้อยยิ่งประหยัด'
              : 'Click column headers to sort | Lower time = faster, Lower RAM = less memory'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            {lang === 'th' ? 'เร็วกว่า (Faster)' : 'Fastest'}
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1 text-indigo-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
            {lang === 'th' ? 'ประหยัดแรม (Lowest RAM)' : 'Lowest RAM'}
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-semibold select-none">
              <th
                onClick={() => handleSort('rank')}
                className="py-3 px-4 cursor-pointer hover:text-slate-200 transition text-center w-16"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>{lang === 'th' ? 'อันดับ' : 'Rank'}</span>
                  {getSortIcon('rank')}
                </div>
              </th>

              <th className="py-3 px-4 min-w-[200px]">
                <span>{lang === 'th' ? 'ผู้เข้าแข่งขัน / โค้ดของใคร' : 'Contestant / Code'}</span>
              </th>

              <th
                onClick={() => handleSort('meanTime')}
                className="py-3 px-4 cursor-pointer hover:text-slate-200 transition text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'th' ? 'เวลาเฉลี่ย (Mean)' : 'Mean Time'}</span>
                  {getSortIcon('meanTime')}
                </div>
              </th>

              <th
                onClick={() => handleSort('medianTime')}
                className="py-3 px-4 cursor-pointer hover:text-slate-200 transition text-right hidden md:table-cell"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>{lang === 'th' ? 'มัธยฐาน (Median)' : 'Median'}</span>
                  {getSortIcon('medianTime')}
                </div>
              </th>

              <th
                onClick={() => handleSort('minTime')}
                className="py-3 px-4 cursor-pointer hover:text-slate-200 transition text-right hidden lg:table-cell"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>{lang === 'th' ? 'ช่วง (Min / Max)' : 'Min / Max'}</span>
                  {getSortIcon('minTime')}
                </div>
              </th>

              <th
                onClick={() => handleSort('memory')}
                className="py-3 px-4 cursor-pointer hover:text-slate-200 transition text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{lang === 'th' ? 'การใช้แรม (Peak RAM)' : 'Peak RAM'}</span>
                  {getSortIcon('memory')}
                </div>
              </th>

              <th className="py-3 px-4 text-center hidden sm:table-cell">
                <div className="flex items-center justify-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Big-O</span>
                </div>
              </th>

              <th
                onClick={() => handleSort('speedup')}
                className="py-3 px-4 cursor-pointer hover:text-slate-200 transition text-right min-w-[120px]"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>{lang === 'th' ? 'อัตราความเร็ว' : 'Comparison'}</span>
                  {getSortIcon('speedup')}
                </div>
              </th>

              <th className="py-3 px-4 text-center w-16">
                <span>{lang === 'th' ? 'โค้ด' : 'Code'}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono">
            {sortedResults.map((result, idx) => {
              const comp = compMap.get(result.competitorId);
              const isFastest = result.meanTimeNs === baselineFastest;
              const isLowestMem = result.peakMemoryBytes === lowestMemory;
              const speedRatio = (result.meanTimeNs / baselineFastest).toFixed(2);
              const isSlowest = Number(speedRatio) > 2;

              return (
                <tr
                  key={result.competitorId}
                  className={`hover:bg-slate-800/40 transition duration-150 ${
                    isFastest ? 'bg-emerald-950/15' : ''
                  }`}
                >
                  {/* Rank */}
                  <td className="py-3.5 px-4 text-center">
                    {idx === 0 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
                        1
                      </span>
                    ) : idx === 1 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-700 text-slate-200 font-bold text-xs border border-slate-600">
                        2
                      </span>
                    ) : idx === 2 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-800/30 text-amber-500 font-bold text-xs border border-amber-700/40">
                        3
                      </span>
                    ) : (
                      <span className="text-slate-500 font-semibold text-xs">{idx + 1}</span>
                    )}
                  </td>

                  {/* Contestant Name & Author */}
                  <td className="py-3.5 px-4 font-sans">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: comp?.color || '#6366f1' }}
                      />
                      <div>
                        <div className="font-bold text-slate-100 flex items-center gap-1.5">
                          {result.competitorName}
                          {isFastest && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
                              ⚡ เร็วที่สุด
                            </span>
                          )}
                          {isLowestMem && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/30">
                              💾 ประหยัดแรม
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 font-normal mt-0.5">
                          {result.author}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Mean Time */}
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`font-semibold ${
                        isFastest ? 'text-emerald-400 font-bold' : isSlowest ? 'text-rose-400' : 'text-slate-200'
                      }`}
                    >
                      {formatTime(result.meanTimeNs)}
                    </span>
                    <div className="text-[10px] text-slate-500 font-sans">
                      ±{formatTime(result.stdDevNs)}
                    </div>
                  </td>

                  {/* Median Time */}
                  <td className="py-3.5 px-4 text-right hidden md:table-cell text-slate-300">
                    {formatTime(result.medianTimeNs)}
                  </td>

                  {/* Min / Max Range */}
                  <td className="py-3.5 px-4 text-right hidden lg:table-cell text-xs text-slate-400">
                    <span>{formatTime(result.minTimeNs)}</span>
                    <span className="text-slate-600 mx-1">/</span>
                    <span>{formatTime(result.maxTimeNs)}</span>
                  </td>

                  {/* Peak RAM */}
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`font-semibold ${
                        isLowestMem ? 'text-indigo-400 font-bold' : 'text-slate-300'
                      }`}
                    >
                      {formatBytes(result.peakMemoryBytes)}
                    </span>
                  </td>

                  {/* Big-O */}
                  <td className="py-3.5 px-4 text-center hidden sm:table-cell">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-xs border border-slate-700/60 font-medium">
                      {result.estimatedComplexity}
                    </span>
                  </td>

                  {/* Speedup Comparison */}
                  <td className="py-3.5 px-4 text-right font-sans">
                    {isFastest ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        {lang === 'th' ? 'เกณฑ์หลัก (1.0x)' : 'Baseline'}
                      </span>
                    ) : (
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-rose-400 font-mono">
                          {speedRatio}x
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {lang === 'th' ? 'ช้ากว่าแชมป์' : 'slower'}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* View code button */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => onSelectCompetitor?.(result.competitorId)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                      title={lang === 'th' ? 'ดูและแก้ไขโค้ด' : 'Inspect & Edit Code'}
                      aria-label={`View code for ${result.competitorName}`}
                    >
                      <FileCode className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer info */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 px-4 sm:px-6">
        <div>
          {lang === 'th'
            ? '💡 ข้อสังเกตสำหรับนักศึกษา: อัลกอริทึมที่มี Big-O ดีกว่าจะเห็นผลต่างของเวลาชัดเจนขึ้นอย่างมหาศาลเมื่อขนาดข้อมูล N เพิ่มขึ้น'
            : '💡 Tip for students: Algorithms with better Big-O show dramatically larger performance gaps as input size N grows'}
        </div>
        <div className="font-mono text-[11px] text-slate-500">
          Timestamp: {new Date(summary.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
