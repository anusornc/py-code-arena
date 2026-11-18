import {
  BenchmarkSummary,
  Competitor,
  CompetitorResult,
  ScalabilityPoint,
  TestCase,
} from '../types/benchmark';

/**
 * Format execution time into readable string with appropriate units.
 * ns -> μs -> ms -> s
 */
export function formatTime(ns: number): string {
  if (ns === undefined || isNaN(ns) || ns < 0) return '0 ns';
  if (ns < 1_000) {
    return `${Math.round(ns)} ns`;
  }
  if (ns < 1_000_000) {
    const us = ns / 1_000;
    return `${us < 10 ? us.toFixed(2) : us < 100 ? us.toFixed(1) : Math.round(us)} μs`;
  }
  if (ns < 1_000_000_000) {
    const ms = ns / 1_000_000;
    return `${ms < 10 ? ms.toFixed(2) : ms < 100 ? ms.toFixed(1) : Math.round(ms)} ms`;
  }
  const s = ns / 1_000_000_000;
  return `${s.toFixed(3)} s`;
}

/**
 * Format bytes into readable string (B, KB, MB)
 */
export function formatBytes(bytes: number): string {
  if (bytes === undefined || isNaN(bytes) || bytes <= 0) return '0 B';
  if (bytes < 1024) {
    return `${Math.round(bytes)} B`;
  }
  if (bytes < 1024 * 1024) {
    const kb = bytes / 1024;
    return `${kb < 10 ? kb.toFixed(2) : kb.toFixed(1)} KB`;
  }
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}

/**
 * Calculate statistical metrics from a sample of nanosecond timings
 */
export function calculateStats(times: number[]): {
  mean: number;
  median: number;
  min: number;
  max: number;
  stdDev: number;
} {
  if (!times || times.length === 0) {
    return { mean: 0, median: 0, min: 0, max: 0, stdDev: 0 };
  }

  const sorted = [...times].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = sum / sorted.length;

  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;

  const variance =
    sorted.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / sorted.length;
  const stdDev = Math.sqrt(variance);

  return { mean, median, min, max, stdDev };
}

/**
 * Calculate speedup ratio: slower / faster (e.g. 4.2x)
 */
export function calculateSpeedup(fastestNs: number, competitorNs: number): number {
  if (fastestNs <= 0 || competitorNs <= 0) return 1.0;
  return Number((competitorNs / fastestNs).toFixed(2));
}

/**
 * Estimate empirical time complexity Big-O based on scaling points (N vs Time)
 */
export function estimateComplexity(points: ScalabilityPoint[]): string {
  if (!points || points.length < 2) return 'O(?)';
  const valid = points.filter((p) => p.n > 0 && p.timeNs > 0);
  if (valid.length < 2) return 'O(?)';

  const p1 = valid[0];
  const p2 = valid[valid.length - 1];

  const ratioN = p2.n / p1.n;
  const ratioT = p2.timeNs / p1.timeNs;

  if (ratioN <= 1) return 'O(1)';

  // log(ratioT) / log(ratioN) gives the empirical polynomial exponent
  const exponent = Math.log(ratioT) / Math.log(ratioN);

  if (exponent < 0.2) return 'O(1)';
  if (exponent < 0.6) return 'O(log N)';
  if (exponent <= 1.25) return 'O(N)';
  if (exponent <= 1.65) return 'O(N log N)';
  if (exponent <= 2.4) return 'O(N²)';
  if (exponent <= 3.4) return 'O(N³)';
  return 'O(2^N) / Exponential';
}

/**
 * Generate clean Markdown comparison table suitable for lab reports, README, or Discord
 */
export function generateMarkdownTable(
  summary: BenchmarkSummary,
  competitors: Competitor[]
): string {
  const compMap = new Map(competitors.map((c) => [c.id, c]));

  let md = `### 🏆 Python Code Arena — Benchmark Report\n\n`;
  md += `> **Generated on:** ${new Date(summary.timestamp).toLocaleString()}\n`;
  md += `> **Iterations per test:** ${summary.iterationsPerTest} runs (with ${summary.warmupRuns} warmup runs)\n\n`;

  // Summary Highlights
  const winnerSpeed = summary.results.find((r) => r.competitorId === summary.winnerSpeedId);
  const winnerMem = summary.results.find((r) => r.competitorId === summary.winnerMemoryId);

  if (winnerSpeed) {
    md += `- ⚡ **Speed Champion:** ${winnerSpeed.competitorName} (${winnerSpeed.author}) — **${formatTime(winnerSpeed.meanTimeNs)}**\n`;
  }
  if (winnerMem) {
    md += `- 💾 **Memory Champion:** ${winnerMem.competitorName} (${winnerMem.author}) — **${formatBytes(winnerMem.peakMemoryBytes)}**\n`;
  }
  if (summary.speedupFactor > 1) {
    md += `- 🚀 **Speedup:** ${summary.speedupFactor}x faster than slowest contestant\n`;
  }
  md += `\n`;

  // Main Performance Table
  md += `#### 📊 Overall Performance Comparison Table\n\n`;
  md += `| Rank | Competitor / Student | Mean Time | Median Time | Min Time | Max Time | Peak RAM | Est. Big-O | Speedup |\n`;
  md += `| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n`;

  // Sort by mean time
  const sorted = [...summary.results].sort((a, b) => a.meanTimeNs - b.meanTimeNs);
  const bestTime = sorted[0]?.meanTimeNs || 1;

  sorted.forEach((res, idx) => {
    const rankBadge = idx === 0 ? '🥇 1st' : idx === 1 ? '🥈 2nd' : idx === 2 ? '🥉 3rd' : `${idx + 1}th`;
    const speedup = (res.meanTimeNs / bestTime).toFixed(2);
    const speedupText = idx === 0 ? 'Baseline (1.0x)' : `${speedup}x slower`;
    md += `| ${rankBadge} | **${res.competitorName}**<br>_${res.author}_ | ${formatTime(res.meanTimeNs)} | ${formatTime(res.medianTimeNs)} | ${formatTime(res.minTimeNs)} | ${formatTime(res.maxTimeNs)} | ${formatBytes(res.peakMemoryBytes)} | \`${res.estimatedComplexity}\` | ${speedupText} |\n`;
  });

  md += `\n`;

  // Per Test Case Table
  if (sorted[0]?.testCaseResults && sorted[0].testCaseResults.length > 0) {
    md += `#### 🧪 Test Cases Correctness & Timings\n\n`;
    md += `| Test Case | Status | ` + sorted.map((s) => `${s.competitorName}`).join(' | ') + ` |\n`;
    md += `| :--- | :---: | ` + sorted.map(() => `:---:`).join(' | ') + ` |\n`;

    const testCount = sorted[0].testCaseResults.length;
    for (let i = 0; i < testCount; i++) {
      const test = sorted[0].testCaseResults[i];
      const allPassed = sorted.every((s) => s.testCaseResults[i]?.passed);
      const statusIcon = allPassed ? '✅ Passed' : '⚠️ Mismatch';
      const rowTimes = sorted
        .map((s) => formatTime(s.testCaseResults[i]?.timeNs || 0))
        .join(' | ');
      md += `| **${test.testLabel}** | ${statusIcon} | ${rowTimes} |\n`;
    }
  }

  return md;
}

/**
 * Generate CSV export data
 */
export function generateCsv(summary: BenchmarkSummary): string {
  const rows: string[] = [
    [
      'Rank',
      'Competitor',
      'Author',
      'Mean Time (ns)',
      'Formatted Mean',
      'Median Time (ns)',
      'Min Time (ns)',
      'Max Time (ns)',
      'StdDev (ns)',
      'Peak Memory (bytes)',
      'Formatted Memory',
      'Estimated Big-O',
    ].join(','),
  ];

  const sorted = [...summary.results].sort((a, b) => a.meanTimeNs - b.meanTimeNs);
  sorted.forEach((r, idx) => {
    rows.push(
      [
        idx + 1,
        `"${r.competitorName.replace(/"/g, '""')}"`,
        `"${r.author.replace(/"/g, '""')}"`,
        r.meanTimeNs,
        `"${formatTime(r.meanTimeNs)}"`,
        r.medianTimeNs,
        r.minTimeNs,
        r.maxTimeNs,
        r.stdDevNs,
        r.peakMemoryBytes,
        `"${formatBytes(r.peakMemoryBytes)}"`,
        `"${r.estimatedComplexity}"`,
      ].join(',')
    );
  });

  return rows.join('\n');
}

/**
 * Deep equality for comparing outputs of functions
 */
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;

  // Handle number precision close enough
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) < 1e-7;
  }

  // Handle array comparisons
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  // Handle object comparisons
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }

  return false;
}
