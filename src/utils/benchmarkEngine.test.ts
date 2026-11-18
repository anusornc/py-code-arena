import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatTime,
  formatBytes,
  calculateStats,
  calculateSpeedup,
  estimateComplexity,
  deepEqual,
  generateMarkdownTable,
  generateCsv,
} from './benchmarkEngine';
import { BenchmarkSummary, Competitor } from '../types/benchmark';

test('formatTime formats nanoseconds properly', () => {
  assert.equal(formatTime(450), '450 ns');
  assert.equal(formatTime(1200), '1.20 μs');
  assert.equal(formatTime(250_000), '250 μs');
  assert.equal(formatTime(15_400_000), '15.4 ms');
  assert.equal(formatTime(2_500_000_000), '2.500 s');
});

test('formatBytes formats bytes properly', () => {
  assert.equal(formatBytes(512), '512 B');
  assert.equal(formatBytes(2048), '2.00 KB');
  assert.equal(formatBytes(1048576 * 2.5), '2.50 MB');
});

test('calculateStats produces accurate mean, median, min, max, stdDev', () => {
  const data = [10, 20, 30, 40, 50];
  const stats = calculateStats(data);
  assert.equal(stats.mean, 30);
  assert.equal(stats.median, 30);
  assert.equal(stats.min, 10);
  assert.equal(stats.max, 50);
  assert.ok(Math.abs(stats.stdDev - 14.142) < 0.01);
});

test('calculateSpeedup calculates relative factor', () => {
  assert.equal(calculateSpeedup(100, 400), 4.0);
  assert.equal(calculateSpeedup(200, 300), 1.5);
  assert.equal(calculateSpeedup(0, 100), 1.0);
});

test('estimateComplexity estimates reasonable big-O', () => {
  // Constant O(1)
  const o1 = [
    { n: 100, label: '100', timeNs: 1000, memoryBytes: 100 },
    { n: 10000, label: '10k', timeNs: 1050, memoryBytes: 100 },
  ];
  assert.equal(estimateComplexity(o1), 'O(1)');

  // Linear O(N)
  const on = [
    { n: 100, label: '100', timeNs: 1000, memoryBytes: 100 },
    { n: 10000, label: '10k', timeNs: 100000, memoryBytes: 1000 },
  ];
  assert.equal(estimateComplexity(on), 'O(N)');

  // Quadratic O(N^2)
  const on2 = [
    { n: 100, label: '100', timeNs: 10000, memoryBytes: 100 },
    { n: 1000, label: '1k', timeNs: 1000000, memoryBytes: 100 },
  ];
  assert.equal(estimateComplexity(on2), 'O(N²)');
});

test('deepEqual handles arrays and nested structures', () => {
  assert.equal(deepEqual([1, 2, 3], [1, 2, 3]), true);
  assert.equal(deepEqual([1, 2, 3], [1, 2, 4]), false);
  assert.equal(deepEqual({ a: 1, b: [2, 3] }, { a: 1, b: [2, 3] }), true);
});

test('generateMarkdownTable produces clean markdown output', () => {
  const summary: BenchmarkSummary = {
    winnerSpeedId: 'comp-1',
    winnerMemoryId: 'comp-1',
    speedupFactor: 3.5,
    memoryReductionPct: 40,
    timestamp: Date.now(),
    iterationsPerTest: 20,
    warmupRuns: 3,
    allOutputsMatch: true,
    results: [
      {
        competitorId: 'comp-1',
        competitorName: 'QuickSort',
        author: 'Student A',
        meanTimeNs: 1000000,
        medianTimeNs: 980000,
        minTimeNs: 950000,
        maxTimeNs: 1100000,
        stdDevNs: 50000,
        peakMemoryBytes: 4096,
        testCaseResults: [],
        scalingResults: [],
        estimatedComplexity: 'O(N log N)',
        executionStatus: 'success',
      },
      {
        competitorId: 'comp-2',
        competitorName: 'BubbleSort',
        author: 'Student B',
        meanTimeNs: 3500000,
        medianTimeNs: 3400000,
        minTimeNs: 3300000,
        maxTimeNs: 3700000,
        stdDevNs: 120000,
        peakMemoryBytes: 8192,
        testCaseResults: [],
        scalingResults: [],
        estimatedComplexity: 'O(N²)',
        executionStatus: 'success',
      },
    ],
  };

  const competitors: Competitor[] = [
    { id: 'comp-1', name: 'QuickSort', author: 'Student A', color: '#10b981', code: '', entryFunction: 'solve' },
    { id: 'comp-2', name: 'BubbleSort', author: 'Student B', color: '#ef4444', code: '', entryFunction: 'solve' },
  ];

  const md = generateMarkdownTable(summary, competitors);
  assert.ok(md.includes('QuickSort'));
  assert.ok(md.includes('BubbleSort'));
  assert.ok(md.includes('| Rank |'));
  assert.ok(md.includes('3.5x'));

  const csv = generateCsv(summary);
  assert.ok(csv.includes('QuickSort'));
  assert.ok(csv.includes('BubbleSort'));
  assert.ok(csv.includes('Mean Time (ns)'));
});
