/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Trophy,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  HardDrive,
  Cpu,
  Layers,
  Info,
} from 'lucide-react';

import {
  BenchmarkConfig,
  BenchmarkSummary,
  ChallengePreset,
  Competitor,
  TestCase,
} from './types/benchmark';
import { CHALLENGE_PRESETS } from './data/presets';
import { Header } from './components/Header';
import { ArenaShowdownHeader } from './components/ArenaShowdownHeader';
import { PerformanceTable } from './components/PerformanceTable';
import { TestCaseResultsTable } from './components/TestCaseResultsTable';
import { ScalabilityChart } from './components/ScalabilityChart';
import { CompetitorEditor } from './components/CompetitorEditor';
import { TestCaseManager } from './components/TestCaseManager';
import { ExportModal } from './components/ExportModal';
import { BigOGuideModal } from './components/BigOGuideModal';
import {
  executeArenaBenchmark,
  initPyodide,
  isPyodideAvailable,
} from './utils/pythonRunner';

export default function App() {
  const [lang, setLang] = useState<'th' | 'en'>('th');
  const [currentPreset, setCurrentPreset] = useState<ChallengePreset>(CHALLENGE_PRESETS[0]);
  const [competitors, setCompetitors] = useState<Competitor[]>(CHALLENGE_PRESETS[0].competitors);
  const [testCases, setTestCases] = useState<TestCase[]>(CHALLENGE_PRESETS[0].testCases);

  const [benchmarkConfig, setBenchmarkConfig] = useState<BenchmarkConfig>({
    iterations: 40,
    warmup: 3,
    checkCorrectness: true,
    benchmarkScaling: true,
  });

  const [summary, setSummary] = useState<BenchmarkSummary | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [runProgress, setRunProgress] = useState<{
    completed: number;
    total: number;
    currentName: string;
  } | null>(null);

  const [selectedCompId, setSelectedCompId] = useState<string | undefined>(undefined);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [pyodideStatus, setPyodideStatus] = useState<'ready' | 'loading' | 'fallback'>('loading');

  // Initialize Pyodide on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const ok = await initPyodide();
      if (isMounted) {
        setPyodideStatus(ok ? 'ready' : 'fallback');
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Run benchmark handler
  const handleRunBenchmark = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setRunProgress({
      completed: 0,
      total: competitors.length,
      currentName: competitors[0]?.name || 'Initializing...',
    });

    try {
      const res = await executeArenaBenchmark(
        competitors,
        testCases,
        benchmarkConfig,
        (progress) => {
          setRunProgress(progress);
        }
      );
      setSummary(res);
    } catch (err) {
      console.error('Benchmark execution error:', err);
    } finally {
      setIsRunning(false);
      setRunProgress(null);
    }
  }, [competitors, testCases, benchmarkConfig, isRunning]);

  // Run on initial page load so students immediately see the table & results
  useEffect(() => {
    handleRunBenchmark();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle switching preset
  const handleSelectPreset = (preset: ChallengePreset) => {
    setCurrentPreset(preset);
    setCompetitors(JSON.parse(JSON.stringify(preset.competitors)));
    setTestCases(JSON.parse(JSON.stringify(preset.testCases)));

    // Re-run benchmark for the new preset after brief tick
    setTimeout(async () => {
      setIsRunning(true);
      try {
        const res = await executeArenaBenchmark(
          preset.competitors,
          preset.testCases,
          benchmarkConfig
        );
        setSummary(res);
      } finally {
        setIsRunning(false);
      }
    }, 100);
  };

  // Reset current preset to original code
  const handleResetToDefault = () => {
    const original = CHALLENGE_PRESETS.find((p) => p.id === currentPreset.id);
    if (original) {
      setCompetitors(JSON.parse(JSON.stringify(original.competitors)));
      setTestCases(JSON.parse(JSON.stringify(original.testCases)));
    }
  };

  // Update competitor code/metadata
  const handleChangeCompetitor = (index: number, updated: Competitor) => {
    const next = [...competitors];
    next[index] = updated;
    setCompetitors(next);
  };

  // Add 3rd or 4th competitor
  const handleAddCompetitor = () => {
    if (competitors.length >= 4) return;
    const newIdx = competitors.length + 1;
    const newComp: Competitor = {
      id: `comp-${Date.now()}`,
      name: `Student ${newIdx} Algorithm`,
      author: `เพื่อนคนที่ ${newIdx} (Classmate ${newIdx})`,
      color: '#ec4899', // Pink
      entryFunction: competitors[0]?.entryFunction || 'solve',
      code: `# โค้ดของเพื่อนคนที่ ${newIdx}\n${competitors[0]?.code || 'def solve(arr):\n    return arr\n'}`,
    };
    setCompetitors([...competitors, newComp]);
  };

  // Remove competitor
  const handleRemoveCompetitor = (index: number) => {
    if (competitors.length <= 2) return;
    const next = competitors.filter((_, i) => i !== index);
    setCompetitors(next);
  };

  // Reset a single competitor
  const handleResetCompetitor = (index: number) => {
    const orig = currentPreset.competitors[index];
    if (orig) {
      handleChangeCompetitor(index, JSON.parse(JSON.stringify(orig)));
    }
  };

  // Keyboard shortcut Ctrl+Enter / Cmd+Enter to run arena
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunBenchmark();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleRunBenchmark]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Header
        currentPreset={currentPreset}
        onSelectPreset={handleSelectPreset}
        onRunBenchmark={handleRunBenchmark}
        isRunning={isRunning}
        benchmarkConfig={benchmarkConfig}
        onChangeConfig={setBenchmarkConfig}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onResetToDefault={handleResetToDefault}
        lang={lang}
        onToggleLang={() => setLang(lang === 'th' ? 'en' : 'th')}
        pyodideStatus={pyodideStatus}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Challenge Introduction Banner */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 mb-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {currentPreset.category.toUpperCase()}
                </span>
                <span className="text-xs text-slate-400">
                  Difficulty:{' '}
                  <span
                    className={
                      currentPreset.difficulty === 'Easy'
                        ? 'text-emerald-400 font-semibold'
                        : currentPreset.difficulty === 'Medium'
                        ? 'text-amber-400 font-semibold'
                        : 'text-rose-400 font-semibold'
                    }
                  >
                    {currentPreset.difficulty}
                  </span>
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {lang === 'th' ? currentPreset.titleTh : currentPreset.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-4xl">
                {lang === 'th' ? currentPreset.descriptionTh : currentPreset.description}
              </p>
            </div>

            {/* Quick Run CTA banner */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                onClick={handleRunBenchmark}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md disabled:opacity-50 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{lang === 'th' ? 'รันเปรียบเทียบ (Ctrl+Enter)' : 'Run Test (Ctrl+Enter)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Running Progress Bar Overlay */}
        {isRunning && runProgress && (
          <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-4 mb-6 animate-pulse">
            <div className="flex items-center justify-between text-xs text-indigo-300 mb-2">
              <span className="flex items-center gap-2 font-semibold">
                <div className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                <span>
                  {lang === 'th' ? 'กำลังทดสอบ:' : 'Benchmarking:'} {runProgress.currentName}
                </span>
              </span>
              <span className="font-mono">
                {runProgress.completed} / {runProgress.total} contestants
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-indigo-900">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-300"
                style={{
                  width: `${Math.max(10, (runProgress.completed / runProgress.total) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* 1. ARENA SHOWDOWN VERDICT CARD */}
        {summary && (
          <ArenaShowdownHeader summary={summary} competitors={competitors} lang={lang} />
        )}

        {/* 2. MAIN PERFORMANCE COMPARISON TABLE */}
        {summary && (
          <PerformanceTable
            summary={summary}
            competitors={competitors}
            lang={lang}
            onSelectCompetitor={(id) => {
              setSelectedCompId(id);
              // Smooth scroll to code editor
              document.getElementById('code-editors-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}

        {/* 3. SCALABILITY TIME COMPLEXITY GRAPH */}
        {summary && summary.results.length > 0 && (
          <ScalabilityChart summary={summary} competitors={competitors} lang={lang} />
        )}

        {/* 4. PER TEST CASE VERIFICATION TABLE */}
        {summary && (
          <TestCaseResultsTable
            summary={summary}
            competitors={competitors}
            testCases={testCases}
            lang={lang}
          />
        )}

        {/* 5. CODE EDITORS FOR ALL CONTESTANTS */}
        <div id="code-editors-section">
          <CompetitorEditor
            competitors={competitors}
            onChangeCompetitor={handleChangeCompetitor}
            onAddCompetitor={handleAddCompetitor}
            onRemoveCompetitor={handleRemoveCompetitor}
            onResetCompetitor={handleResetCompetitor}
            selectedCompId={selectedCompId}
            lang={lang}
          />
        </div>

        {/* 6. TEST CASES SUITE MANAGER */}
        <TestCaseManager
          testCases={testCases}
          onUpdateTestCases={setTestCases}
          lang={lang}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Python Code Arena & Algorithm Benchmark Suite — ออกแบบเพื่อการเรียนการสอนและวิเคราะห์ประสิทธิภาพอัลกอริทึม
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-white transition cursor-pointer"
            >
              Big-O Guide
            </button>
            <span>•</span>
            <button
              onClick={() => setIsExportOpen(true)}
              className="hover:text-white transition cursor-pointer"
            >
              Export Report
            </button>
          </div>
        </div>
      </footer>

      {/* Export Modal */}
      <ExportModal
        summary={summary}
        competitors={competitors}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        lang={lang}
      />

      {/* Big-O Guide Modal */}
      <BigOGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        lang={lang}
      />
    </div>
  );
}
