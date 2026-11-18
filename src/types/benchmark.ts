export type ProblemCategory = 'sorting' | 'search' | 'math' | 'string' | 'custom';

export type SizeTag = 'S' | 'M' | 'L' | 'XL' | 'Edge';

export interface TestCase {
  id: string;
  label: string;
  description: string;
  inputCode: string; // Python expression or data passed to the function
  expectedOutputCode?: string;
  sizeTag: SizeTag;
  n: number; // approximate N scale value for complexity plots
}

export interface Competitor {
  id: string;
  name: string; // e.g. "QuickSort (Pivot Median)"
  author: string; // e.g. "นายชยพล (Student A)"
  color: string; // hex or tailwind color
  code: string;
  entryFunction: string; // name of function to call, e.g. "solve"
}

export interface TestCaseResult {
  testId: string;
  testLabel: string;
  passed: boolean;
  timeNs: number;
  memoryBytes: number;
  actualOutputStr: string;
  expectedOutputStr?: string;
  error?: string;
}

export interface ScalabilityPoint {
  n: number;
  label: string;
  timeNs: number;
  memoryBytes: number;
}

export interface CompetitorResult {
  competitorId: string;
  competitorName: string;
  author: string;
  meanTimeNs: number;
  medianTimeNs: number;
  minTimeNs: number;
  maxTimeNs: number;
  stdDevNs: number;
  peakMemoryBytes: number;
  testCaseResults: TestCaseResult[];
  scalingResults: ScalabilityPoint[];
  estimatedComplexity: string;
  executionStatus: 'success' | 'error' | 'timeout' | 'pending';
  errorMessage?: string;
}

export interface BenchmarkSummary {
  winnerSpeedId: string;
  winnerMemoryId: string;
  speedupFactor: number;
  memoryReductionPct: number;
  results: CompetitorResult[];
  timestamp: number;
  iterationsPerTest: number;
  warmupRuns: number;
  allOutputsMatch: boolean;
}

export interface BenchmarkConfig {
  iterations: number;
  warmup: number;
  checkCorrectness: boolean;
  benchmarkScaling: boolean;
}

export interface ChallengePreset {
  id: string;
  title: string;
  titleTh: string;
  category: ProblemCategory;
  description: string;
  descriptionTh: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  competitors: Competitor[];
  testCases: TestCase[];
}
