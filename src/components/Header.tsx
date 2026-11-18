import React, { useState } from 'react';
import {
  Play,
  Settings2,
  Share2,
  BookOpen,
  Code2,
  Sparkles,
  RotateCcw,
  Cpu,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { ChallengePreset, BenchmarkConfig } from '../types/benchmark';
import { CHALLENGE_PRESETS } from '../data/presets';

interface HeaderProps {
  currentPreset: ChallengePreset;
  onSelectPreset: (preset: ChallengePreset) => void;
  onRunBenchmark: () => void;
  isRunning: boolean;
  benchmarkConfig: BenchmarkConfig;
  onChangeConfig: (cfg: BenchmarkConfig) => void;
  onOpenExport: () => void;
  onOpenGuide: () => void;
  onResetToDefault: () => void;
  lang: 'th' | 'en';
  onToggleLang: () => void;
  pyodideStatus: 'ready' | 'loading' | 'fallback';
}

export const Header: React.FC<HeaderProps> = ({
  currentPreset,
  onSelectPreset,
  onRunBenchmark,
  isRunning,
  benchmarkConfig,
  onChangeConfig,
  onOpenExport,
  onOpenGuide,
  onResetToDefault,
  lang,
  onToggleLang,
  pyodideStatus,
}) => {
  const [showConfigModal, setShowConfigModal] = useState(false);

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & App Title */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-mono font-bold text-base sm:text-lg flex-shrink-0">
              &gt;_
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="font-bold text-sm sm:text-lg text-slate-100 tracking-tight flex items-center gap-1.5 whitespace-nowrap">
                  <span>Python Arena</span>
                  <span className="hidden lg:inline-block px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Benchmark Suite
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 hidden xl:block">
                {lang === 'th'
                  ? 'เปรียบเทียบประสิทธิภาพโค้ด ความเร็ว และการใช้หน่วยความจำ'
                  : 'Benchmark & compare code execution time, memory and complexity'}
              </p>
            </div>
          </div>

          {/* Preset Selector */}
          <div className="flex-1 max-w-xs md:max-w-md hidden md:flex items-center gap-2">
            <label htmlFor="preset-select" className="text-xs text-slate-400 font-medium whitespace-nowrap">
              {lang === 'th' ? 'โจทย์ประลอง:' : 'Challenge:'}
            </label>
            <select
              id="preset-select"
              aria-label={lang === 'th' ? 'เลือกโจทย์ประลอง' : 'Select challenge preset'}
              value={currentPreset.id}
              onChange={(e) => {
                const found = CHALLENGE_PRESETS.find((p) => p.id === e.target.value);
                if (found) onSelectPreset(found);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer font-medium"
            >
              {CHALLENGE_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {lang === 'th' ? p.titleTh : p.title} ({p.difficulty})
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Pyodide / Engine Status pill */}
            <div
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                pyodideStatus === 'ready'
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                  : pyodideStatus === 'loading'
                  ? 'bg-amber-950/40 border-amber-800 text-amber-300 animate-pulse'
                  : 'bg-indigo-950/40 border-indigo-800 text-indigo-300'
              }`}
              title={
                pyodideStatus === 'ready'
                  ? 'Running full Python 3.12 WebAssembly in your browser with tracemalloc'
                  : pyodideStatus === 'loading'
                  ? 'Initializing Python WebAssembly environment...'
                  : 'Using high-speed native execution engine'
              }
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>
                {pyodideStatus === 'ready'
                  ? 'Python WASM Ready'
                  : pyodideStatus === 'loading'
                  ? 'Loading WASM...'
                  : 'Turbo Engine'}
              </span>
            </div>

            {/* Config Button */}
            <button
              onClick={() => setShowConfigModal(!showConfigModal)}
              className="hidden sm:flex p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              title={lang === 'th' ? 'ตั้งค่าการวัดผล (Iterations / Warmup)' : 'Benchmark Settings'}
              aria-label="Benchmark Settings"
            >
              <Settings2 className="w-4 h-4" />
            </button>

            {/* Guide Button */}
            <button
              onClick={onOpenGuide}
              className="hidden sm:flex p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              title={lang === 'th' ? 'คู่มือ Big-O & การวัดผล' : 'Big-O & Profiling Guide'}
              aria-label="Profiling Guide"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            {/* Export Button */}
            <button
              onClick={onOpenExport}
              className="hidden sm:flex p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              title={lang === 'th' ? 'ส่งออกผลลัพธ์ (Markdown / CSV)' : 'Export Results'}
              aria-label="Export Results"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Language toggle */}
            <button
              onClick={onToggleLang}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition flex-shrink-0"
              title="สลับภาษา / Toggle Language"
            >
              {lang === 'th' ? 'TH|EN' : 'EN|TH'}
            </button>

            {/* PRIMARY BENCHMARK BUTTON */}
            <button
              onClick={onRunBenchmark}
              disabled={isRunning}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
            >
              {isRunning ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline">{lang === 'th' ? 'กำลังประลอง...' : 'Benchmarking...'}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{lang === 'th' ? 'ประลองโค้ด' : 'Run Arena'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Preset Selector Bar */}
        <div className="py-2.5 border-t border-slate-800/80 md:hidden flex items-center justify-between gap-2">
          <label htmlFor="mobile-preset-select" className="text-xs text-slate-400 font-medium">
            {lang === 'th' ? 'โจทย์:' : 'Preset:'}
          </label>
          <select
            id="mobile-preset-select"
            aria-label={lang === 'th' ? 'เลือกโจทย์ประลองมือถือ' : 'Mobile challenge preset'}
            value={currentPreset.id}
            onChange={(e) => {
              const found = CHALLENGE_PRESETS.find((p) => p.id === e.target.value);
              if (found) onSelectPreset(found);
            }}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200"
          >
            {CHALLENGE_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {lang === 'th' ? p.titleTh : p.title}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowConfigModal(!showConfigModal)}
            className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
            title={lang === 'th' ? 'ตั้งค่าการวัดผล' : 'Settings'}
            aria-label="Mobile Settings"
          >
            <Settings2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenGuide}
            className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
            title={lang === 'th' ? 'คู่มือ Big-O' : 'Guide'}
            aria-label="Mobile Guide"
          >
            <BookOpen className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenExport}
            className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
            title={lang === 'th' ? 'ส่งออกผลลัพธ์' : 'Export'}
            aria-label="Mobile Export"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onResetToDefault}
            className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
            title="รีเซ็ตโค้ดเดิม"
            aria-label="Reset Code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Benchmark Settings Modal */}
      {showConfigModal && (
        <div className="absolute right-4 top-18 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-indigo-400" />
              {lang === 'th' ? 'ตั้งค่าการวัดผล (Config)' : 'Benchmark Config'}
            </h2>
            <button
              onClick={() => setShowConfigModal(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 pt-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>{lang === 'th' ? 'จำนวนรอบทดสอบ (Iterations):' : 'Iterations per test:'}</span>
                <span className="font-mono text-emerald-400 font-bold">{benchmarkConfig.iterations} runs</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="10"
                value={benchmarkConfig.iterations}
                onChange={(e) =>
                  onChangeConfig({ ...benchmarkConfig, iterations: Number(e.target.value) })
                }
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                {lang === 'th'
                  ? 'รอบมากขึ้นช่วยลดค่าความแปรปรวน (Variance/StdDev)'
                  : 'Higher iterations reduce statistical noise'}
              </p>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>{lang === 'th' ? 'รอบอุ่นเครื่อง (Warmup runs):' : 'Warmup runs:'}</span>
                <span className="font-mono text-amber-400 font-bold">{benchmarkConfig.warmup} runs</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={benchmarkConfig.warmup}
                onChange={(e) =>
                  onChangeConfig({ ...benchmarkConfig, warmup: Number(e.target.value) })
                }
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                {lang === 'th' ? 'ป้องกันผลกระทบจากการโหลดแคชครั้งแรก' : 'Prevents JIT / cache cold start skew'}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">
                {lang === 'th' ? 'ตรวจสอบผลลัพธ์ตรงกัน (Check Match)' : 'Verify output match'}
              </span>
              <input
                type="checkbox"
                checked={benchmarkConfig.checkCorrectness}
                onChange={(e) =>
                  onChangeConfig({ ...benchmarkConfig, checkCorrectness: e.target.checked })
                }
                className="rounded border-slate-700 text-indigo-500 focus:ring-indigo-500 accent-indigo-500 cursor-pointer"
              />
            </div>

            <button
              onClick={() => setShowConfigModal(false)}
              className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition"
            >
              {lang === 'th' ? 'บันทึกการตั้งค่า' : 'Done'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
