import React, { useEffect } from 'react';
import {
  Trophy,
  Zap,
  HardDrive,
  CheckCircle,
  AlertTriangle,
  Flame,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BenchmarkSummary, Competitor } from '../types/benchmark';
import { formatTime, formatBytes } from '../utils/benchmarkEngine';

interface ArenaShowdownHeaderProps {
  summary: BenchmarkSummary;
  competitors: Competitor[];
  lang: 'th' | 'en';
}

export const ArenaShowdownHeader: React.FC<ArenaShowdownHeaderProps> = ({
  summary,
  competitors,
  lang,
}) => {
  const winnerSpeed = summary.results.find((r) => r.competitorId === summary.winnerSpeedId);
  const winnerMem = summary.results.find((r) => r.competitorId === summary.winnerMemoryId);

  // Trigger celebration confetti on new benchmark completion
  useEffect(() => {
    if (summary && summary.results.length > 0) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.3 },
          colors: ['#10b981', '#6366f1', '#f59e0b'],
        });
      } catch {
        // Safe fail
      }
    }
  }, [summary.timestamp]);

  if (!winnerSpeed) return null;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden mb-6">
      {/* Background ambient glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Trophy className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  {lang === 'th' ? 'ผลการประลอง (Arena Verdict)' : 'Arena Verdict'}
                </span>
                <span className="text-xs text-slate-400">
                  {summary.iterationsPerTest} runs/test ({summary.warmupRuns} warmup)
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-bold text-white tracking-tight mt-0.5">
                {lang === 'th' ? 'ตารางสรุปผลแพ้ชนะและประสิทธิภาพ' : 'Head-to-Head Performance Verdict'}
              </h2>
            </div>
          </div>

          {/* Correctness Pill */}
          <div className="flex items-center gap-2">
            {summary.allOutputsMatch ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'th' ? 'ผลลัพธ์ถูกต้องตรงกันทุกกรณี' : 'Outputs Match 100%'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{lang === 'th' ? 'ผลลัพธ์บางชุดไม่ตรงกัน (โปรดตรวจสอบ)' : 'Output Mismatch Detected'}</span>
              </div>
            )}
          </div>
        </div>

        {/* 3 Main Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Winner Speed Card */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 shadow-sm relative">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <Zap className="w-3.5 h-3.5 fill-emerald-400" />
                {lang === 'th' ? 'แชมป์ความเร็ว (Fastest)' : 'Speed Champion'}
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                1st Place
              </span>
            </div>
            <div className="font-bold text-slate-100 text-sm truncate" title={winnerSpeed.competitorName}>
              {winnerSpeed.competitorName}
            </div>
            <div className="text-xs text-slate-400 truncate mb-1.5">{winnerSpeed.author}</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-emerald-400 font-mono">
                {formatTime(winnerSpeed.meanTimeNs)}
              </span>
              <span className="text-xs text-slate-400">mean</span>
            </div>
          </div>

          {/* Winner Memory Card */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-indigo-500/30 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1 text-indigo-400 font-semibold">
                <HardDrive className="w-3.5 h-3.5" />
                {lang === 'th' ? 'ประหยัดหน่วยความจำที่สุด' : 'Memory Champion'}
              </span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-mono">
                Lowest RAM
              </span>
            </div>
            <div
              className="font-bold text-slate-100 text-sm truncate"
              title={winnerMem?.competitorName || ''}
            >
              {winnerMem?.competitorName || 'N/A'}
            </div>
            <div className="text-xs text-slate-400 truncate mb-1.5">{winnerMem?.author || ''}</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-indigo-400 font-mono">
                {formatBytes(winnerMem?.peakMemoryBytes || 0)}
              </span>
              <span className="text-xs text-slate-400">peak</span>
            </div>
          </div>

          {/* Head-to-Head Ratio Card */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/30 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                {lang === 'th' ? 'อัตราความเร็วต่างกัน (Speedup)' : 'Relative Speedup'}
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                Ratio
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-400 tracking-tight font-mono">
                {summary.speedupFactor}x
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {lang === 'th' ? 'เร็วกว่าตัวช้าที่สุด' : 'faster than baseline'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
              {lang === 'th'
                ? `ลดการใช้แรมได้สูงสุด ${summary.memoryReductionPct}%`
                : `Memory saved up to ${summary.memoryReductionPct}%`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
